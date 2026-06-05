from __future__ import annotations

import csv
import json
import re
import time
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import List, Optional
from urllib.parse import urljoin

from playwright.sync_api import Browser, BrowserContext, Page, TimeoutError as PlaywrightTimeoutError, sync_playwright

BASE_URL = "https://www.a90shop.com/toyota-gr-supra-a90-parts"
OUTPUT_ROOT = Path("data/a90shop_supra_categories")
DEBUG_DIR = OUTPUT_ROOT / "debug"


@dataclass
class CategoryOption:
    text: str
    value: Optional[str]
    data_hook: Optional[str]


@dataclass
class ProductRecord:
    category: str
    category_value: Optional[str]
    product_name: Optional[str] = None
    brand: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = None
    regular_price: Optional[float] = None
    sale_price: Optional[float] = None
    currency: str = "USD"
    description: Optional[str] = None
    specifications: Optional[str] = None
    fitment: Optional[str] = None
    features: Optional[str] = None
    image_urls: List[str] = field(default_factory=list)
    product_url: Optional[str] = None
    source_product_id: Optional[str] = None
    breadcrumb: Optional[str] = None
    scraped_at: Optional[str] = None


def clean_text(value: Optional[str]) -> str:
    if not value:
        return ""
    return re.sub(r"\s+", " ", value).strip()


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = value.replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "_", value)
    return re.sub(r"_+", "_", value).strip("_")


def parse_price(text: Optional[str]) -> Optional[float]:
    if not text:
        return None
    m = re.search(r"\$\s*([\d,]+(?:\.\d{2})?)", text)
    if not m:
        return None
    try:
        return float(m.group(1).replace(",", ""))
    except ValueError:
        return None


def ensure_dirs(category_slug: str) -> Path:
    out = OUTPUT_ROOT / category_slug
    out.mkdir(parents=True, exist_ok=True)
    DEBUG_DIR.mkdir(parents=True, exist_ok=True)
    return out


class A90ShopSidebarCategoryScraper:
    def __init__(self, headless: bool = False, slow_mo: int = 100):
        self.headless = headless
        self.slow_mo = slow_mo
        self.play = None
        self.browser: Browser | None = None
        self.context: BrowserContext | None = None
        self.page: Page | None = None

    def __enter__(self):
        self.play = sync_playwright().start()
        self.browser = self.play.chromium.launch(headless=self.headless, slow_mo=self.slow_mo)
        self.context = self.browser.new_context(viewport={"width": 1600, "height": 1200})
        self.page = self.context.new_page()
        self.page.set_default_timeout(20000)
        return self

    def __exit__(self, exc_type, exc, tb):
        try:
            if self.browser:
                self.browser.close()
        finally:
            if self.play:
                self.play.stop()

    def goto(self, url: str) -> None:
        assert self.page is not None
        self.page.goto(url, wait_until="domcontentloaded")
        self.page.wait_for_timeout(1800)
        try:
            self.page.locator("body").first.wait_for(state="visible", timeout=10000)
        except Exception:
            pass

    def dismiss_popups(self) -> None:
        assert self.page is not None
        selectors = [
            "button:has-text('Accept')",
            "button:has-text('Close')",
            "button[aria-label='Close']",
            "[data-hook='close-button']",
        ]
        for sel in selectors:
            try:
                btn = self.page.locator(sel).first
                if btn.count() and btn.is_visible():
                    btn.click(force=True, timeout=2000)
                    self.page.wait_for_timeout(500)
            except Exception:
                continue

    def save_debug(self, name: str) -> None:
        assert self.page is not None
        DEBUG_DIR.mkdir(parents=True, exist_ok=True)
        try:
            self.page.screenshot(path=str(DEBUG_DIR / f"{name}.png"), full_page=True)
        except Exception:
            pass
        try:
            html = self.page.content()
            (DEBUG_DIR / f"{name}.html").write_text(html, encoding="utf-8")
        except Exception:
            pass

    def category_sidebar(self):
        assert self.page is not None
        selectors = [
            "[data-hook='filter-type-COLLECTION'] [data-hook='single-selection-filter']",
            "[data-hook='filter-type-COLLECTION']",
            "[data-hook='single-selection-filter']",
        ]
        for sel in selectors:
            box = self.page.locator(sel).first
            try:
                if box.count() and box.is_visible():
                    return box
            except Exception:
                continue
        return None

    def get_category_options(self) -> List[CategoryOption]:
        assert self.page is not None
        self.goto(BASE_URL)
        self.dismiss_popups()
        self.save_debug("landing")

        sidebar = self.category_sidebar()
        if sidebar is None:
            raise RuntimeError("Could not find category sidebar.")

        rows = sidebar.locator("li[data-hook^='single-selection-option']")
        count = rows.count()
        out: List[CategoryOption] = []
        raw = []
        for i in range(count):
            row = rows.nth(i)
            label = row.locator("label[data-hook='label']").first
            inp = row.locator("input[data-hook='radio-option-input']").first
            text = clean_text(label.text_content() if label.count() else row.text_content())
            value = inp.get_attribute("value") if inp.count() else None
            hook = row.get_attribute("data-hook")
            raw.append({"text": text, "value": value, "data_hook": hook})
            if not text or text in {"All", "Category", "Clear", "Clear Filters"}:
                continue
            out.append(CategoryOption(text=text, value=value, data_hook=hook))

        (DEBUG_DIR / "category_options.json").write_text(
            json.dumps([asdict(x) for x in out], indent=2), encoding="utf-8"
        )
        (DEBUG_DIR / "category_options_raw.json").write_text(json.dumps(raw, indent=2), encoding="utf-8")
        print(f"[DEBUG] categories found: {len(out)}")
        print("[DEBUG] categories:", [c.text for c in out])
        return out

    def click_category(self, category: CategoryOption) -> None:
        assert self.page is not None
        self.goto(BASE_URL)
        self.dismiss_popups()
        sidebar = self.category_sidebar()
        if sidebar is None:
            raise RuntimeError("Could not find category sidebar before clicking.")

        row = None
        if category.value:
            row = sidebar.locator(
                f"input[data-hook='radio-option-input'][value='{category.value}']"
            ).locator("xpath=ancestor::li[1]").first
        if row is None or row.count() == 0:
            row = sidebar.locator("li[data-hook^='single-selection-option']").filter(
                has_text=category.text
            ).first
        if row.count() == 0:
            raise RuntimeError(f"Could not find sidebar row for category: {category.text}")

        row.scroll_into_view_if_needed(timeout=5000)
        self.page.wait_for_timeout(300)

        clicked = False
        strategies = [
            lambda: row.locator("label[data-hook='label']").first.click(force=True, timeout=5000),
            lambda: row.click(force=True, timeout=5000),
            lambda: row.locator("input[data-hook='radio-option-input']").first.check(force=True, timeout=5000),
        ]
        for action in strategies:
            try:
                action()
                clicked = True
                break
            except Exception:
                continue
        if not clicked:
            raise RuntimeError(f"Unable to click category: {category.text}")

        self.page.wait_for_timeout(2500)
        self.dismiss_popups()
        self.expand_all_visible_products()
        self.save_debug(f"category_{slugify(category.text)}")

    def expand_all_visible_products(self) -> None:
        assert self.page is not None
        load_more_selectors = [
            "button:has-text('Load More')",
            "a:has-text('Load More')",
            "[role='button']:has-text('Load More')",
        ]
        for _ in range(40):
            clicked = False
            for sel in load_more_selectors:
                try:
                    btn = self.page.locator(sel).first
                    if btn.count() and btn.is_visible():
                        btn.scroll_into_view_if_needed(timeout=3000)
                        btn.click(force=True, timeout=5000)
                        self.page.wait_for_timeout(2200)
                        clicked = True
                        break
                except Exception:
                    continue
            if not clicked:
                break

    def collect_product_urls_for_current_category(self, category: CategoryOption) -> List[str]:
        assert self.page is not None
        selectors = [
            "a[href*='/product-page/']",
            "a[href*='/product-page']",
        ]
        urls: List[str] = []
        for sel in selectors:
            try:
                hrefs = self.page.locator(sel).evaluate_all(
                    """
                    (nodes) => nodes
                        .map(n => n.href || n.getAttribute('href') || '')
                        .filter(Boolean)
                    """
                )
                urls.extend(hrefs)
            except Exception:
                continue

        clean_urls = []
        seen = set()
        for url in urls:
            full = urljoin(BASE_URL, url)
            if "/product-page/" not in full:
                continue
            low = full.lower()
            if low not in seen:
                seen.add(low)
                clean_urls.append(full)

        (DEBUG_DIR / f"{slugify(category.text)}_links.json").write_text(
            json.dumps(clean_urls, indent=2), encoding="utf-8"
        )
        print(f"[CATEGORY] {category.text}: product links found = {len(clean_urls)}")
        return clean_urls


    def is_bad_product_name(self, text: Optional[str]) -> bool:
        text = clean_text(text).lower()
        if not text:
            return True
        bad_fragments = [
            "buy now pay later",
            "pay later",
            "affirm",
            "klarna",
            "shop pay",
            "afterpay",
            "sezzle",
            "zip payment",
        ]
        return any(fragment in text for fragment in bad_fragments)

    def extract_product_title(self) -> Optional[str]:
        assert self.page is not None

        title_candidates = [
            "[data-hook='product-title']",
            "h1[data-hook='product-title']",
            "main [data-hook='product-title']",
            "h1",
            "title",
        ]

        for sel in title_candidates:
            try:
                nodes = self.page.locator(sel)
                count = min(nodes.count(), 5)
                for i in range(count):
                    text = clean_text(nodes.nth(i).text_content())
                    if text and not self.is_bad_product_name(text):
                        return text
            except Exception:
                continue

        return None

    def extract_description(self) -> Optional[str]:
        assert self.page is not None

        selectors = [
            "[data-hook='description']",
            "main [data-hook='description']",
            "[data-hook='description'] *",
        ]

        texts = []
        for sel in selectors:
            try:
                nodes = self.page.locator(sel)
                if nodes.count() == 0:
                    continue
                extracted = nodes.evaluate_all(
                    """
                    (nodes) => nodes
                        .map(n => (n && typeof n.textContent === 'string') ? n.textContent.trim() : '')
                        .filter(Boolean)
                    """
                )
                for t in extracted:
                    ct = clean_text(t)
                    if not ct:
                        continue
                    low = ct.lower()
                    if low in {"description", "product description"}:
                        continue
                    if len(ct) < 2:
                        continue
                    texts.append(ct)
                if texts:
                    break
            except Exception:
                continue

        if texts:
            dedup = []
            seen = set()
            for t in texts:
                if t not in seen:
                    seen.add(t)
                    dedup.append(t)
            joined = "\n".join(dedup)
            return clean_text(joined)

        return self.extract_text_by_heading(["DESCRIPTION"])

    def extract_text_by_heading(self, headings: List[str]) -> Optional[str]:
        assert self.page is not None
        body = clean_text(self.page.locator("body").text_content())
        if not body:
            return None
        for heading in headings:
            pattern = re.compile(
                rf"{re.escape(heading)}\s*(.*?)(?=(DESCRIPTION|SPECIFICATIONS|FITMENT|FEATURES|SKU|$))",
                re.IGNORECASE | re.DOTALL,
            )
            m = pattern.search(body)
            if m:
                text = clean_text(m.group(1))
                if text:
                    return text
        return None

    def extract_product(self, category: CategoryOption, product_url: str) -> ProductRecord:
        assert self.page is not None
        self.goto(product_url)
        self.dismiss_popups()

        title = self.extract_product_title()

        body_text = clean_text(self.page.locator("body").text_content())
        sku_match = re.search(r"SKU\s*:?\s*([A-Za-z0-9_./\-]+)", body_text, re.IGNORECASE)
        sku = sku_match.group(1).strip() if sku_match else None

        breadcrumb = None
        for sel in ["nav[aria-label='Breadcrumbs']", "[data-hook='breadcrumbs']", "nav"]:
            try:
                node = self.page.locator(sel).first
                if node.count():
                    text = clean_text(node.text_content())
                    if text and len(text) < 400:
                        breadcrumb = text
                        break
            except Exception:
                continue

        price = None
        regular_price = None
        sale_price = None
        price_text_candidates = []
        for sel in ["[data-hook='formatted-primary-price']", "[data-hook='product-price']", "[class*='price']"]:
            try:
                nodes = self.page.locator(sel)
                cnt = min(nodes.count(), 8)
                for i in range(cnt):
                    t = clean_text(nodes.nth(i).text_content())
                    if t:
                        price_text_candidates.append(t)
            except Exception:
                continue
        if not price_text_candidates:
            price_text_candidates = re.findall(r"\$[\d,]+(?:\.\d{2})?", body_text)
        nums = [parse_price(x) for x in price_text_candidates]
        nums = [x for x in nums if x is not None]
        if nums:
            sale_price = min(nums)
            regular_price = max(nums)
            price = sale_price if len(nums) > 1 else nums[0]

        description = self.extract_description()
        specifications = self.extract_text_by_heading(["SPECIFICATIONS", "SPECIFICATION"])
        fitment = self.extract_text_by_heading(["FITMENT", "VEHICLE FITMENT"])
        features = self.extract_text_by_heading(["FEATURES", "KEY FEATURES"])

        image_urls = []
        try:
            img_candidates = self.page.locator("img").evaluate_all(
                """
                (nodes) => nodes
                    .map(n => n.currentSrc || n.src || n.getAttribute('src') || '')
                    .filter(Boolean)
                """
            )
            for src in img_candidates:
                full = urljoin(product_url, src)
                if "static.wixstatic.com" in full or "/media/" in full or full.startswith("http"):
                    image_urls.append(full)
        except Exception:
            pass
        dedup_images = []
        seen = set()
        for img in image_urls:
            if img not in seen:
                seen.add(img)
                dedup_images.append(img)

        brand = None
        if title:
            brand = title.split()[0]

        source_product_id = None
        m = re.search(r"/product-page/([^/?#]+)", product_url)
        if m:
            source_product_id = m.group(1)

        return ProductRecord(
            category=category.text,
            category_value=category.value,
            product_name=title,
            brand=brand,
            sku=sku,
            price=price,
            regular_price=regular_price,
            sale_price=sale_price,
            description=description,
            specifications=specifications,
            fitment=fitment,
            features=features,
            image_urls=dedup_images,
            product_url=product_url,
            source_product_id=source_product_id,
            breadcrumb=breadcrumb,
            scraped_at=time.strftime("%Y-%m-%d %H:%M:%S"),
        )

    def save_category_records(self, category: CategoryOption, records: List[ProductRecord]) -> None:
        slug = slugify(category.text)
        out_dir = ensure_dirs(slug)
        csv_path = out_dir / f"{slug}.csv"
        jsonl_path = out_dir / f"{slug}.jsonl"

        rows = []
        for rec in records:
            row = asdict(rec)
            row["image_urls"] = json.dumps(rec.image_urls)
            rows.append(row)

        fields = [
            "category",
            "category_value",
            "product_name",
            "brand",
            "sku",
            "price",
            "regular_price",
            "sale_price",
            "currency",
            "description",
            "specifications",
            "fitment",
            "features",
            "image_urls",
            "product_url",
            "source_product_id",
            "breadcrumb",
            "scraped_at",
        ]

        with csv_path.open("w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fields)
            writer.writeheader()
            writer.writerows(rows)

        with jsonl_path.open("w", encoding="utf-8") as f:
            for rec in records:
                f.write(json.dumps(asdict(rec), ensure_ascii=False) + "\n")

    def scrape_category(self, category: CategoryOption) -> List[ProductRecord]:
        print(f"\n[CATEGORY] Scraping: {category.text} (value={category.value})")
        self.click_category(category)
        links = self.collect_product_urls_for_current_category(category)
        records: List[ProductRecord] = []
        for idx, url in enumerate(links, start=1):
            try:
                print(f"  [{idx}/{len(links)}] {url}")
                rec = self.extract_product(category, url)
                records.append(rec)
            except Exception as e:
                print(f"  [WARN] Failed product: {url} -> {e}")
        self.save_category_records(category, records)
        return records

    def scrape_all_categories(self) -> None:
        categories = self.get_category_options()
        summary = []
        for cat in categories:
            try:
                records = self.scrape_category(cat)
                summary.append(
                    {
                        "category": cat.text,
                        "value": cat.value,
                        "count": len(records),
                        "slug": slugify(cat.text),
                    }
                )
            except Exception as e:
                print(f"[ERROR] Category failed: {cat.text} -> {e}")
                summary.append(
                    {
                        "category": cat.text,
                        "value": cat.value,
                        "count": 0,
                        "slug": slugify(cat.text),
                        "error": str(e),
                    }
                )

        OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
        (OUTPUT_ROOT / "summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
        print("\n[DONE] Summary written to", OUTPUT_ROOT / "summary.json")


if __name__ == "__main__":
    with A90ShopSidebarCategoryScraper(headless=False, slow_mo=100) as scraper:
        scraper.scrape_all_categories()

import os
import re
import time
import json
from dataclasses import dataclass, asdict
from typing import Optional, List, Dict, Any
from urllib.parse import urljoin

import dotenv
import pandas as pd
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeoutError

# =========================
# Config
# =========================
dotenv.load_dotenv()
HP_ACADEMY_EMAIL = os.getenv("HPACDMY_LOGIN_EMAIL")
HP_ACADEMY_PASSWORD = os.getenv("HPACDMY_LOGIN_PASSWORD")

BASE_URL = "https://www.hpacademy.com"
DASHBOARD_URL = f"{BASE_URL}/dashboard"

HEADLESS = False
NAV_TIMEOUT_MS = 60000
WAIT_TIMEOUT_MS = 20000

COURSES_CSV = "hpacademy_courses.csv"
CONTENT_JSONL = "hpacademy_course_content.jsonl"
CONTENT_CSV = "hpacademy_course_content.csv"


# =========================
# Data models
# =========================
@dataclass
class CourseItem:
    course_type: str
    section: str
    course_name: str
    course_url: str

    module_title: Optional[str]
    module_url: Optional[str]

    item_type: str          # video | quiz | review | unknown
    item_title: str
    item_url: str
    item_id: Optional[str] = None
    duration_or_score: Optional[str] = None
    watched: Optional[bool] = None

    # extracted on lesson pages
    lesson_title: Optional[str] = None
    video_url: Optional[str] = None                 # e.g. vimeo player url
    vimeo_id: Optional[str] = None
    transcript: Optional[str] = None                # plain text transcript
    transcript_rows: Optional[List[Dict[str, Any]]] = None  # [{ts, seconds, text}, ...]


# =========================
# Helpers
# =========================
def safe_text(el) -> str:
    if not el:
        return ""
    return el.get_text(" ", strip=True)


def normalize_ws(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "")).strip()


def to_abs(href: str) -> str:
    if not href:
        return href
    if href.startswith("http"):
        return href
    return urljoin(BASE_URL, href)


def robust_goto(page, url: str, timeout_ms: int = NAV_TIMEOUT_MS, tries: int = 3) -> None:
    last_err = None
    for _ in range(tries):
        try:
            page.goto(url, timeout=timeout_ms)
            page.wait_for_load_state("networkidle", timeout=timeout_ms)
            return
        except Exception as e:
            last_err = e
            time.sleep(1.0)
    raise last_err


# =========================
# Dashboard parsing
# =========================
def scrape_dashboard_courses(html: str) -> pd.DataFrame:
    """
    Extracts all owned courses from the dashboard page.
    """
    soup = BeautifulSoup(html, "html.parser")
    results = []

    for section in soup.select("div.courses-wrapper"):
        course_type = safe_text(section.find("h3"))

        for h4 in section.find_all("h4"):
            section_name = safe_text(h4)
            ul = h4.find_next_sibling("ul")
            if not ul:
                continue

            for li in ul.find_all("li", class_="owned"):
                a = li.find("a", href=True)
                if not a:
                    continue
                course_name_span = a.find("span", class_="course-name")
                course_name = safe_text(course_name_span) or safe_text(a)
                href = a["href"]

                results.append(
                    {
                        "Course Type": course_type,
                        "Section": section_name,
                        "Course Name": course_name,
                        "Link": href,
                    }
                )

    df = pd.DataFrame(results)
    df.to_csv(COURSES_CSV, index=False)
    return df


# =========================
# Course overview page parsing (modules list page)
# =========================
def is_course_overview_page(html: str) -> bool:
    soup = BeautifulSoup(html, "html.parser")
    return bool(soup.select_one("div.main-content div.module"))


def parse_course_overview_items(
    html: str,
    course_meta: Dict[str, str],
    course_url: str,
) -> List[CourseItem]:
    """
    Parses the course overview page containing many <div class="module"> blocks and
    <div class="video-list"> entries.
    """
    soup = BeautifulSoup(html, "html.parser")
    items: List[CourseItem] = []

    for mod in soup.select("div.main-content div.module"):
        module_title = safe_text(mod.select_one("div.title-row h3 a")) or safe_text(mod.select_one("h3")) or None
        module_href = mod.select_one("div.title-row h3 a[href]")
        module_url = to_abs(module_href["href"]) if module_href else None

        for li in mod.select("div.video-list ul.list-unstyled > li"):
            li_classes = set(li.get("class", []))

            # some items have the main url under span.title a[href]
            a = li.select_one("span.title a[href]") or li.select_one("a[href]")
            item_title = safe_text(li.select_one("span.title")) or safe_text(a) or "(untitled item)"
            item_href = a["href"] if a and a.has_attr("href") else ""
            item_url = to_abs(item_href) if item_href else (module_url or course_url)

            item_id = li.get("data-id")
            watched = "watched" in li_classes

            if "quiz" in li_classes:
                item_type = "quiz"
                duration_or_score = safe_text(li.select_one("span.time.score")) or safe_text(li.select_one("span.time"))
            elif "member-review" in li_classes:
                item_type = "review"
                duration_or_score = None
            elif "course-component" in li_classes:
                item_type = "video"
                duration_or_score = safe_text(li.select_one("span.time"))
            else:
                item_type = "unknown"
                duration_or_score = safe_text(li.select_one("span.time"))

            # Optional: skip review links like "Leave a review"
            if item_type == "review" and "Leave a review" in (item_title or ""):
                continue

            items.append(
                CourseItem(
                    course_type=course_meta["Course Type"],
                    section=course_meta["Section"],
                    course_name=course_meta["Course Name"],
                    course_url=course_url,
                    module_title=module_title,
                    module_url=module_url,
                    item_type=item_type,
                    item_title=item_title,
                    item_url=item_url,
                    item_id=item_id,
                    duration_or_score=duration_or_score,
                    watched=watched,
                )
            )

    return items


# =========================
# Lesson page parsing (video + transcript page)
# =========================
def extract_lesson_title(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    return safe_text(soup.select_one("div.content h1")) or safe_text(soup.select_one("h1")) or "(lesson)"


def extract_duration_from_lesson(html: str) -> Optional[str]:
    soup = BeautifulSoup(html, "html.parser")
    length = soup.select_one("h3.length")
    return length.get_text(strip=True) if length else None


def extract_video_info_from_lesson(html: str) -> Dict[str, Optional[str]]:
    """
    HPA lesson pages often encode video as:
      <a class="video-trigger" data-vimeoid="171381914" ... id="vimeo-id-171381914">
    """
    soup = BeautifulSoup(html, "html.parser")

    trigger = soup.select_one("a.video-trigger[data-vimeoid], a.video-trigger[id^='vimeo-id-']")
    vimeoid = None
    if trigger:
        vimeoid = trigger.get("data-vimeoid")
        if not vimeoid:
            m = re.search(r"vimeo-id-(\d+)", trigger.get("id", ""))
            vimeoid = m.group(1) if m else None

    if vimeoid:
        return {"vimeo_id": vimeoid, "video_url": f"https://player.vimeo.com/video/{vimeoid}"}

    # fallback to iframe src if present
    iframe = soup.select_one("iframe[src]")
    if iframe and iframe.get("src"):
        return {"vimeo_id": None, "video_url": iframe["src"].strip()}

    # fallback to <video src> / <source src>
    vid = soup.select_one("video source[src], video[src]")
    if vid:
        src = vid.get("src")
        if src:
            return {"vimeo_id": None, "video_url": src.strip()}

    return {"vimeo_id": None, "video_url": None}


def extract_transcript_from_lesson(html: str) -> Dict[str, Any]:
    """
    Transcript is in:
      <div id="course-transcript" class="course-transcript">
        <table>
          <tr><td>00:00</td><td><span data-seconds="0">...</span></td></tr>
    Returns plain transcript text + structured rows.
    """
    soup = BeautifulSoup(html, "html.parser")

    transcript_rows: List[Dict[str, Any]] = []
    t = soup.select_one("#course-transcript, .course-transcript")

    if t:
        for tr in t.select("table tr"):
            tds = tr.find_all("td")
            if len(tds) < 2:
                continue

            ts = tds[0].get_text(" ", strip=True)
            span = tds[1].select_one("span[data-seconds]") or tds[1].find("span")

            text = span.get_text(" ", strip=True) if span else tds[1].get_text(" ", strip=True)
            text = normalize_ws(text)

            seconds = None
            if span and span.has_attr("data-seconds"):
                try:
                    seconds = int(span["data-seconds"])
                except Exception:
                    seconds = None

            if text:
                transcript_rows.append({"ts": ts, "seconds": seconds, "text": text})

    transcript_text = normalize_ws(" ".join(r["text"] for r in transcript_rows))

    # fallback: any transcript-ish container
    if not transcript_text:
        node = soup.select_one("[id*='transcript'], [class*='transcript']")
        if node:
            transcript_text = normalize_ws(node.get_text(" ", strip=True))

    return {"transcript": transcript_text or None, "transcript_rows": transcript_rows or None}


def scrape_lesson_page(page) -> Dict[str, Any]:
    html = page.content()
    title = extract_lesson_title(html)

    dur = extract_duration_from_lesson(html)
    vinfo = extract_video_info_from_lesson(html)
    tinfo = extract_transcript_from_lesson(html)

    return {
        "lesson_title": title,
        "duration": dur,
        "vimeo_id": vinfo["vimeo_id"],
        "video_url": vinfo["video_url"],
        "transcript": tinfo["transcript"],
        "transcript_rows": tinfo["transcript_rows"],
    }


# =========================
# Main course handler
# =========================
def process_course(page, course_meta: Dict[str, str]) -> List[CourseItem]:
    course_url = to_abs(course_meta["Link"])
    robust_goto(page, course_url)

    # ✅ Don't wait for "visible" — it can exist but never be visible (overlays/hidden duplicates).
    page.wait_for_load_state("domcontentloaded", timeout=NAV_TIMEOUT_MS)

    try:
        page.wait_for_selector("div.content", state="attached", timeout=WAIT_TIMEOUT_MS)
    except Exception:
        # Some pages can still be parsed without this; don't hard fail.
        pass

    # ✅ Wait until we see either an overview marker OR a lesson marker.
    try:
        page.wait_for_function(
            """() => {
                const hasOverview =
                    !!document.querySelector('div.main-content div.module') ||
                    !!document.querySelector('div.video-list ul.list-unstyled');
                const hasTranscript =
                    !!document.querySelector('#course-transcript, .course-transcript');
                const hasVideoTrigger =
                    !!document.querySelector('a.video-trigger[data-vimeoid], a.video-trigger[id^="vimeo-id-"]');
                const hasH1 = !!document.querySelector('h1');
                return hasOverview || hasTranscript || hasVideoTrigger || hasH1;
            }""",
            timeout=WAIT_TIMEOUT_MS
        )
    except Exception:
        # If JS is slow or page is odd, we still proceed with page.content()
        pass

    # Small buffer helps if transcript table is injected after DOMContentLoaded
    page.wait_for_timeout(250)

    html = page.content()

    # -----------------------------
    # Example A: Course overview page with many modules and lists
    # -----------------------------
    if is_course_overview_page(html):
        items = parse_course_overview_items(html, course_meta=course_meta, course_url=course_url)

        # Visit each VIDEO item and pull vimeo/transcript
        for it in items:
            if it.item_type != "video":
                continue

            try:
                robust_goto(page, it.item_url)
                page.wait_for_load_state("domcontentloaded", timeout=NAV_TIMEOUT_MS)

                # Same robust "attached" wait
                try:
                    page.wait_for_selector("div.content", state="attached", timeout=WAIT_TIMEOUT_MS)
                except Exception:
                    pass

                # Wait for lesson markers (transcript or video trigger or h1)
                try:
                    page.wait_for_function(
                        """() => {
                            const hasTranscript =
                                !!document.querySelector('#course-transcript, .course-transcript');
                            const hasVideoTrigger =
                                !!document.querySelector('a.video-trigger[data-vimeoid], a.video-trigger[id^="vimeo-id-"]');
                            const hasH1 = !!document.querySelector('h1');
                            return hasTranscript || hasVideoTrigger || hasH1;
                        }""",
                        timeout=WAIT_TIMEOUT_MS
                    )
                except Exception:
                    pass

                # Give transcript a moment to populate
                page.wait_for_timeout(250)

                lesson = scrape_lesson_page(page)

                it.lesson_title = lesson.get("lesson_title")
                it.vimeo_id = lesson.get("vimeo_id")
                it.video_url = lesson.get("video_url")
                it.transcript = lesson.get("transcript")
                it.transcript_rows = lesson.get("transcript_rows")

                # If duration wasn't present on the overview, fill from lesson page
                if not it.duration_or_score:
                    it.duration_or_score = lesson.get("duration")

            except PWTimeoutError:
                # keep row but missing lesson info
                pass
            except Exception:
                pass

            time.sleep(0.2)

        return items

    # -----------------------------
    # Example B: Direct lesson page (video + transcript) with no module list
    # -----------------------------
    lesson = scrape_lesson_page(page)
    return [
        CourseItem(
            course_type=course_meta["Course Type"],
            section=course_meta["Section"],
            course_name=course_meta["Course Name"],
            course_url=course_url,
            module_title=None,
            module_url=None,
            item_type="video",
            item_title=course_meta["Course Name"],
            item_url=course_url,
            item_id=None,
            duration_or_score=lesson.get("duration"),
            watched=None,
            lesson_title=lesson.get("lesson_title"),
            vimeo_id=lesson.get("vimeo_id"),
            video_url=lesson.get("video_url"),
            transcript=lesson.get("transcript"),
            transcript_rows=lesson.get("transcript_rows"),
        )
    ]



# Script entry point
def main():
    if not HP_ACADEMY_EMAIL or not HP_ACADEMY_PASSWORD:
        raise RuntimeError("Missing HPACDMY_LOGIN_EMAIL / HPACDMY_LOGIN_PASSWORD env vars")

    # clear previous outputs
    if os.path.exists(CONTENT_JSONL):
        os.remove(CONTENT_JSONL)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=HEADLESS)
        page = browser.new_page()

        # 1) Login
        robust_goto(page, BASE_URL)
        page.wait_for_selector("div.main-header__top__login", timeout=WAIT_TIMEOUT_MS)
        page.click("div.main-header__top__login")

        page.fill("input[name='Email']", HP_ACADEMY_EMAIL)
        page.fill("input[name='Password']", HP_ACADEMY_PASSWORD)

        page.wait_for_selector("button:has-text('Continue')", state="visible", timeout=WAIT_TIMEOUT_MS)
        page.click("button:has-text('Continue')")

        page.wait_for_load_state("networkidle", timeout=NAV_TIMEOUT_MS)

        # 2) Dashboard
        robust_goto(page, DASHBOARD_URL)
        page.wait_for_selector("div.dashboard-content", timeout=WAIT_TIMEOUT_MS)

        dashboard_html = page.content()
        df = scrape_dashboard_courses(dashboard_html)
        print(f"Found {len(df)} courses. Saved to {COURSES_CSV}")

        # 3) Iterate courses -> extract content
        all_rows: List[Dict[str, Any]] = []

        for _, row in df.iterrows():
            course_meta = {
                "Course Type": row["Course Type"],
                "Section": row["Section"],
                "Course Name": row["Course Name"],
                "Link": row["Link"],
            }
            print(f"\n=== Processing: {course_meta['Course Name']}")

            items = process_course(page, course_meta)

            batch = [asdict(i) for i in items]
            all_rows.extend(batch)

            with open(CONTENT_JSONL, "a", encoding="utf-8") as f:
                for r in batch:
                    f.write(json.dumps(r, ensure_ascii=False) + "\n")

        # 4) CSV export (flat; transcript_rows will be JSON string)
        out_df = pd.DataFrame(all_rows)
        if "transcript_rows" in out_df.columns:
            out_df["transcript_rows"] = out_df["transcript_rows"].apply(lambda x: json.dumps(x, ensure_ascii=False) if isinstance(x, list) else None)

        out_df.to_csv(CONTENT_CSV, index=False)
        print(f"\nSaved:\n- {COURSES_CSV}\n- {CONTENT_JSONL}\n- {CONTENT_CSV}")

        browser.close()


if __name__ == "__main__":
    main()

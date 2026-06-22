import os
import time
from typing import Protocol
import requests


def get_float_env(name: str, default: float) -> float:
    value = os.getenv(name)
    if value is None:
        return default
    value = value.strip().strip('"').strip("'")
    try:
        return float(value)
    except ValueError:
        return default
    
def get_int_env(name: str, default: int) -> int:
    value = os.getenv(name)
    if value is None:
        return default
    value = value.strip().strip('"').strip("'")
    try:
        return int(float(value))
    except ValueError:
        return default
    
class LLMResponse(dict):
    pass

class LLMProviderError(RuntimeError):
    pass
#setting up protocol for other clients when needed
class LLMClient(Protocol):
    def generate(self, prompt:str) -> tuple[str,float]:
        ...


class OllamaClient:
    def __init__(self):
        self.base_url = os.getenv("LLM_BASE_URL")
        self.model = os.getenv("LLM_MODEL")
        self.temperature = get_float_env("LLM_TEMPERATURE",0.2)
        self.max_output_tokens = get_int_env("LLM_MAX_OUTPUT_TOKENS",800)
        self.timeout_seconds = get_float_env("LLM_TIMEOUT_SECONDS", 120.0)

    
    def generate(self, prompt: str) -> tuple[str, float]:
        start_time = time.perf_counter()

        system_prompt = (
            "You are RedlineIQ Build Copilot. "
            "Use only the retrieved evidence. "
            "Do not invent product claims, prices, fitment, dyno numbers, or reliability outcomes. "
            "If evidence is weak, say that."
        )

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            "stream": False,
            "options": {
                "temperature": self.temperature,
                "num_predict": self.max_output_tokens,
                "num_ctx": 8192},}

        url = f"{self.base_url}/api/chat"

        print("=" * 80)
        print("OLLAMA REQUEST")
        print("URL:", url)
        print("MODEL:", self.model)
        print("PROMPT CHARS:", len(prompt))
        print("MAX OUTPUT TOKENS:", self.max_output_tokens)
        print("=" * 80)

        try:
            response = requests.post(
                url,
                json=payload,
                timeout=self.timeout_seconds,
            )
            #Get a more detailed error response. Easier debugging
            if not response.ok:
                print("=" * 80)
                print("OLLAMA ERROR")
                print("STATUS:", response.status_code)
                print("RESPONSE TEXT:")
                print(response.text)
                print("=" * 80)

                raise LLMProviderError(
                    f"Ollama returned {response.status_code}: {response.text}"
                )

            data = response.json()

            answer = (
                data.get("message", {}).get("content")
                or data.get("response")
                or ""
            ).strip()

            if not answer:
                raise LLMProviderError(
                    f"Ollama returned an empty answer. Raw response: {data}"
                )

            latency_ms = (time.perf_counter() - start_time) * 1000

            return answer, latency_ms

        except requests.exceptions.ConnectionError as exc:
            raise LLMProviderError(
                f"Could not connect to Ollama at {url}. Make sure Ollama is running."
            ) from exc

        except requests.exceptions.Timeout as exc:
            raise LLMProviderError(
                f"Ollama request timed out after {self.timeout_seconds} seconds."
            ) from exc

        except LLMProviderError:
            raise

        except Exception as exc:
            raise LLMProviderError(f"Ollama provider failed: {exc}") from exc
    

def get_llm_client() ->LLMClient:
    llm_provider = os.getenv("LLM_PROVIDER")

    if llm_provider == "ollama":
        return OllamaClient()
    
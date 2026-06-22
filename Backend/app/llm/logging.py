import os
import uuid

from sqlalchemy.orm import Session

from app.database import execute_sql

PROMPT_VERSION = os.getenv("PROMPT_VERSION")
LLM_PROVIDER = os.getenv("LLM_PROVIDER")
LLM_MODEL = os.getenv("LLM_MODEL")

EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL")

def current_model_name() -> str:
    provider = LLM_PROVIDER.lower()

    return LLM_MODEL

def log_llm_run(database: Session, question: str, answer: str, retrieved_chunk_ids: list[str],
                latency_ms: float, vehicle_id: str | None = None, variant_id: str | None = None, use_case: str | None = None, target_whp: float | None = None,) -> str:
    
    run_id = f"llm_{uuid.uuid4().hex[:12]}"

    execute_sql(database,
        """
                INSERT INTO llm_runs (
                    run_id,
                    question,
                    vehicle_id,
                    variant_id,
                    use_case,
                    target_whp,
                    prompt_version,
                    model_name,
                    llm_provider,
                    embedding_model,
                    retrieved_chunk_ids,
                    answer,
                    latency_ms
                )
                VALUES (
                    :run_id,
                    :question,
                    :vehicle_id,
                    :variant_id,
                    :use_case,
                    :target_whp,
                    :prompt_version,
                    :model_name,
                    :llm_provider,
                    :embedding_model,
                    :retrieved_chunk_ids,
                    :answer,
                    :latency_ms
                );""",
        
        {
            "run_id": run_id,
            "question": question,
            "vehicle_id": vehicle_id,
            "variant_id": variant_id,
            "use_case": use_case,
            "target_whp": target_whp,
            "prompt_version": PROMPT_VERSION,
            "model_name": current_model_name(),
            "llm_provider": LLM_PROVIDER,
            "embedding_model": EMBEDDING_MODEL,
            "retrieved_chunk_ids": retrieved_chunk_ids,
            "answer": answer,
            "latency_ms": latency_ms,
        },
    )

    return run_id
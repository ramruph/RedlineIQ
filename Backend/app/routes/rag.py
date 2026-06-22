# backend/app/routes/rag.py

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from app.llm.client import LLMProviderError, get_llm_client
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import get_database
from app.rag.embeddings import embed_query
from app.rag.retriever import retrieve_chunks

from app.llm.client import get_llm_client
from app.llm.logging import log_llm_run
from app.llm.prompts import build_explanation_prompt, build_rag_answer_prompt
from app.rag.embeddings import embed_query
from app.rag.retriever import retrieve_chunks
from app.schemas import BuildExplanationRequest, RagAnswerRequest

router = APIRouter()

class RagSearchRequest(BaseModel):
    question: str
    vehicle_id: str | None = "toyota_gr_supra"
    variant_id: str | None = "toyota_gr_supra_3_0_auto_2024_2025"
    top_k: int = Field(default=5, ge=1, le=20)


@router.post("/search")
def rag_search(request:RagSearchRequest, database: Session = Depends(get_database)):
    query_embedding = embed_query(request.question)

    chunks = retrieve_chunks(
            database=database,
            query_embedding=query_embedding,
            vehicle_id=request.vehicle_id,
            top_k = request.top_k)

    return {
        "question": request.question,
        "result":chunks
    }


@router.post("/answer")
def rag_answer(request: RagAnswerRequest, database: Session = Depends(get_database),):
    query_embedding =  embed_query(request.question)

    chunks = retrieve_chunks( database, query_embedding, request.vehicle_id, request.variant_id, top_k=request.top_k)

    prompt = build_rag_answer_prompt(question=request.question,
                                      chunks=chunks,
                                      vehicle_id=request.vehicle_id,
                                      variant_id=request.variant_id)
    
    llm = get_llm_client()

    answer, latency_ms = llm.generate(prompt)

    run_id = log_llm_run(database=database, question=request.question, answer=answer,retrieved_chunk_ids=[chunk["chunk_id"] for chunk in chunks],
                            latency_ms=latency_ms,
                             vehicle_id=request.vehicle_id,
                              variant_id=request.variant_id)
    
    rag_answer_results = {
        "run_id": run_id,
        "question": request.question,
        "answer": answer,
        "retrieved_chunks": chunks,
        "latency_ms": latency_ms
    }

    return rag_answer_results


@router.post("/build-explanation")
def build_explanation(request: BuildExplanationRequest, database: Session = Depends(get_database)):

    question = (
        f"Explain this {request.use_case} build for a Toyota GR Supra A90"
        f"targeting {request.target_whp}whp with a ${request.budget} budget"
    )

    query_embedding = embed_query(question)

    chunks = retrieve_chunks(
        database=database,
        query_embedding=query_embedding,
        vehicle_id=request.vehicle_id,
        variant_id=request.variant_id,
        top_k=request.top_k)

    recommendation_payload = {
                                "vehicle_id": request.vehicle_id,
                                "variant_id": request.variant_id,
                                "use_case": request.use_case,
                                "target_whp": request.target_whp,
                                "budget": request.budget,
                                "estimated_total_cost": request.estimated_total_cost,
                                "recommended_products": request.recommended_products}
    
    prompt = build_explanation_prompt(recommendations=recommendation_payload, chunks=chunks)

    #Calling the LLM
    llm = get_llm_client()
    answer, latency_ms = llm.generate(prompt)

    try:
        llm = get_llm_client()
        answer, latency_ms = llm.generate(prompt)

    except LLMProviderError as exc:
        raise HTTPException(
            status_code=500,
            detail=f"LLM provider failed: {exc}",
        )

    run_id = log_llm_run(
        database=database,
        question= question,
        answer = answer,
        retrieved_chunk_ids= [chunk["chunk_id"] for chunk in chunks],
        latency_ms=latency_ms,
        vehicle_id=request.vehicle_id,
        variant_id=request.variant_id,
        use_case=request.use_case,
        target_whp=request.target_whp)
    
    result = {
        "run_id":run_id,
        "answer": answer,
        "retrieved_chunks":chunks,
        "latency_ms":latency_ms
    }
    
    return result
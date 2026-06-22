from sqlalchemy.orm import Session
from app.database import find_all


def vector_to_postgres(vector):
    vector = "[" + ",".join(str(float(x)) for x in vector) + "]"
    return vector


def retrieve_chunks(database:Session,
                    query_embedding,
                    vehicle_id:str | None = None,
                    variant_id:str | None = None,
                    top_k: int = 5 ) -> list[dict]:
    sql = """
        SELECT
            chunk_id, 
            source_table,
            source_id,
            vehicle_id,
            variant_id,
            product_id,
            source_type,
            title,
            chunk_text,
            metadata,
            embedding <=> :query_embedding AS distance
        FROM rag_chunks
        WHERE
            embedding IS NOT NULL
            AND (
                :vehicle_id IS NULL
                OR vehicle_id IS NULL
                OR vehicle_id = :vehicle_id)
            AND (
                :variant_id is NULL
                OR variant_id IS NULL
                OR variant_id = :variant_id)
        ORDER BY embedding <=> :query_embedding
        LIMIT :top_k; """
    
    return find_all(database, sql, {
        "query_embedding" : vector_to_postgres(query_embedding),
        "vehicle_id": vehicle_id,
        "variant_id": variant_id,
        "top_k": top_k})
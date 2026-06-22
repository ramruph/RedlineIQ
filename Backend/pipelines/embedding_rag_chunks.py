import os 
from pathlib import Path
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from sqlalchemy import create_engine, text

#Project directory root for .env file
PROJECT_ROOT = Path(__file__).resolve().parents[2]
#load in .env variables
load_dotenv(PROJECT_ROOT / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")

EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL")
EMBEDDING_DIMESION = int(os.getenv("EMBEDDING_DIM"))
EMBEDDING_MAX_CHUNKS = int(os.getenv("MAX_EMBED_CHUNKS"))
BATCH_SIZE = int(os.getenv("EMBEDDING_BATCH_SIZE"))

print(type(EMBEDDING_MAX_CHUNKS))

def vector_to_postgres(vector):
    vector = "[" + ",".join(str(float(x)) for x in vector) + "]"
    return vector

def main():
    db_engine = create_engine(DATABASE_URL)
    model = SentenceTransformer(EMBEDDING_MODEL)

    embedded_total = 0

    while embedded_total < EMBEDDING_MAX_CHUNKS:
        limit = min(BATCH_SIZE, EMBEDDING_MAX_CHUNKS - embedded_total)
    
        with db_engine.connect() as conn:
            rows = conn.execute(text("""
                                    SELECT
                                        chunk_id,
                                        title, 
                                        chunk_text
                                    FROM rag_chunks
                                    WHERE embedding IS NULL
                                        AND chunk_text is NOT NULL
                                    LIMIT :limit;
                                """),
                                {"limit": limit}).mappings().all()
        if not rows:
            break

        chunk_ids = []
        texts = []

        for row in rows:
            chunk_ids.append(row["chunk_id"])
            texts.append(
                f"Title: {row['title'] or ''}\n\nText: {row['chunk_text'] or ''}"
            )
        
        embeddings = model.encode(
            texts,
            normalize_embeddings=True,
            batch_size=BATCH_SIZE
        )

        with db_engine.begin() as conn:
            for chunk_id, embedding in zip(chunk_ids, embeddings):
                if len(embedding) != EMBEDDING_DIMESION:
                    raise ValueError(f"Expected {EMBEDDING_DIMESION} dimensions, got {len(embedding)}.")
                
                conn.execute(
                    text("""
                        UPDATE rag_chunks
                        SET
                            embedding = :embedding,
                            embedding_model = :embedding_model,
                            embedding_dim = :embedding_dim
                        WHERE chunk_id = :chunk_id;
                    """),
                    {
                        "embedding": vector_to_postgres(embedding),
                        "embedding_model": EMBEDDING_MODEL,
                        "embedding_dim": EMBEDDING_DIMESION,
                        "chunk_id": chunk_id,
                    },
                )
        embedded_total += len(rows)
        print(f"Embedded {embedded_total} chunks")
    
    print("Embedding Completed")



if __name__ == "__main__":
    main()
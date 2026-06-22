import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sentence_transformers import SentenceTransformer

#Project directory root for .env file
PROJECT_ROOT = Path(__file__).resolve().parents[3]
#load in .env variables
load_dotenv(PROJECT_ROOT / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL")

def vector_to_postgres(vector):
    vector = "[" + ",".join(str(float(x)) for x in vector) + "]"
    return vector



def main():
    database_engine = create_engine(DATABASE_URL)
    model = SentenceTransformer(EMBEDDING_MODEL)

    question = "Why is cooling important for a track Supra?"
    query_embedding = model.encode(question, normalize_embeddings=True)

    with database_engine.connect() as conn:
        rows = conn.execute(text("""
                                Select
                                    chunk_id,
                                    source_table,
                                    title, 
                                    LEFT(chunk_text, 500) as preview,
                                    embedding <=> :query_embedding as distance
                                FROM rag_chunks
                                WHERE embedding IS NOT NULL
                                ORDER BY embedding <=> :query_embedding
                                LIMIT 20;
                                 """),
                                 {"query_embedding": vector_to_postgres(query_embedding)},).mappings().all()
    for row in rows:
        print("-"*80)
        print("chunk_id:", row["chunk_id"])
        print("source_table:", row["source_table"])
        print("title:", row["title"])
        print("distance:", row["distance"])
        print("preview:", row["preview"])

if __name__ == "__main__":
    main()
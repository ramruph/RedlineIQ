import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text


PROJECT_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(PROJECT_ROOT / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")



def main():
    engine = create_engine(DATABASE_URL)

    
    with engine.begin() as conn:
        #product chunks 
        conn.execute(text("""
            INSERT INTO rag_chunks (
                          chunk_id,
                          source_table,
                          source_id,
                          product_id,
                          source_type,
                          title,
                          chunk_text,
                          metadata
                        )
                        SELECT
                          'product_' || chunk_id AS chunk_id,
                          'product_evidence_chunks' AS source_table,
                          chunk_id AS source_id,
                          product_id, 
                          source_type,
                          product_name AS title,
                          combined_text AS chunk_text,
                          jsonb_build_object(
                                'chunk_type', chunk_type,
                                'product_url', product_url) AS metadata
                        FROM product_evidence_chunks
                        WHERE combined_text is NOT NULL
                        ON CONFLICT (chunk_id) DO UPDATE SET
                            title = EXCLUDED.title, 
                            chunk_text = EXCLUDED.chunk_text,
                            metadata = EXCLUDED.metadata;
        """))

        # Forum evidence Chunks
        conn.execute(text("""
            INSERT INTO rag_chunks (
                          chunk_id,
                          source_table,
                          source_id,
                          vehicle_id,
                          variant_id,
                          source_type,
                          title,
                          chunk_text,
                          metadata
                        )
                        SELECT
                          'forum_' || evidence_id AS chunk_id, 
                          'forum_evidence' AS source_table, 
                          evidence_id AS source_id,
                          vehicle_id,
                          variant_id,
                          evidence_type AS source_type,
                          evidence_type AS title,
                          cleaned_content AS chunk_text,
                          jsonb_build_object(
                                'source_dataset', source_dataset,
                                'track_name', track_name, 
                                'lap_time_seconds', lap_time_seconds, 
                                'evidence_quality_score', evidence_quality_score,
                                'mentioned_categories', mentioned_categories) AS metadata
                        FROM forum_evidence
                        WHERE cleaned_content IS NOT NULL
                        ON CONFLICT (chunk_id) DO UPDATE SET
                            vehicle_id = EXCLUDED.vehicle_id,
                            variant_id = EXCLUDED.variant_id,
                            title = EXCLUDED.title,
                            chunk_text = EXCLUDED.chunk_text,
                            metadata = EXCLUDED.metadata;
                          """))
        #High Performance Academy Chunks
        conn.execute(text("""
            INSERT INTO rag_chunks (
                          chunk_id,
                          source_table,
                          source_id,
                          source_type,
                          title,
                          chunk_text,
                          metadata
                        )
                        SELECT
                          'hpa_' || chunk_id AS chunk_id,
                          'hpacademy_chunks' AS source_table,
                          chunk_id AS source_id,
                          source_type,
                          COALESCE(lesson_title, module_title, course_name) as title,
                          chunk_text,
                          jsonb_build_object(
                                'course_type', course_type,
                                'course_name', course_name, 
                                'module_title', module_title, 
                                'lesson_title', lesson_title, 
                                'item_url', item_url) AS metadata
                        FROM hpacademy_chunks
                        WHERE chunk_text IS NOT NULL
                        ON CONFLICT (chunk_id) DO UPDATE SET
                            title = EXCLUDED.title,
                            chunk_text = EXCLUDED.chunk_text,
                            metadata = EXCLUDED.metadata;
                          """))
    print("RAG Chunks created")

if __name__ == "__main__":
    main()
import os
from sentence_transformers import SentenceTransformer


EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL")

_model = None

def get_embedding_model() -> SentenceTransformer:
    global _model

    if _model is None:
        _model = SentenceTransformer(EMBEDDING_MODEL)
    
    return _model


def embed_query(question):
    model = get_embedding_model()
    return model.encode(question, normalize_embeddings=True)


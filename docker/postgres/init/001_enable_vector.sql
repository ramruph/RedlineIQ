SELECT 'CREATE DATABASE redlineiq OWNER redlineiq'
WHERE NOT EXISTS (
    SELECT FROM pg_database WHERE datname = 'redlineiq'
)\gexec

\connect redlineiq

-- Enable the pgvector vector extensino for Postgresql
CREATE EXTENSION IF NOT EXISTS vector;
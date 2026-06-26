FROM python:3.12-slim

#doesnt create pyc files
ENV PYTHONDONTWRITEBYTECODE=1
#prints logs immediately instead of buffering them
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Setting up python needed packages and build tools (curl, git etc)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY pipelines ./pipelines

EXPOSE 8000

#Allows to run either locally or on Render
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
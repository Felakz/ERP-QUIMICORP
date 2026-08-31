FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY asistencia_worker.py .

# Volumen para persistir la deduplicación entre reinicios
RUN mkdir -p /data

ENV PYTHONUNBUFFERED=1

CMD ["python", "asistencia_worker.py"]

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Dependencias del sistema para PostgreSQL y Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip setuptools wheel

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Archivos estáticos (ignora errores si la DB aún no está lista)
RUN python manage.py collectstatic --no-input || true

# Cloud Run inyecta $PORT en tiempo de ejecución
EXPOSE 8080

CMD sh -c "python manage.py migrate --no-input 2>&1 || echo 'WARNING: migrate failed, continuing'; gunicorn cuadrillamaestra.wsgi:application --bind 0.0.0.0:${PORT:-8080} --workers 2 --timeout 120"

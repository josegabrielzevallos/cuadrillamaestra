# ===== Etapa de build =====
FROM node:20-alpine AS builder

WORKDIR /app

# La URL del backend se inyecta en tiempo de build
ARG REACT_APP_API_URL=http://localhost:8000/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ARG REACT_APP_GOOGLE_CLIENT_ID=
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# ===== Etapa de producción =====
FROM node:20-alpine

WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/build ./build

# Cloud Run inyecta $PORT en tiempo de ejecución
EXPOSE 8080
CMD sh -c "serve -s build -l ${PORT:-8080}"

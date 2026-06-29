@echo off
REM ============================================================
REM  Cuadrilla Maestra - Arranque rápido con Docker Compose
REM ============================================================
echo.
echo  ====================================================
echo   CUADRILLA MAESTRA - Iniciando entorno con Docker
echo  ====================================================
echo.

if not exist "backend\.env" (
    echo Creando backend\.env desde el ejemplo...
    copy "backend\.env.example" "backend\.env"
)

docker compose up --build -d

echo.
echo  Servicios levantados:
echo   - Frontend:  http://localhost:3000
echo   - Backend:   http://localhost:8000/api
echo   - Admin:     http://localhost:8000/admin
echo.
echo  Para cargar datos de ejemplo ejecuta:
echo   docker compose exec backend python manage.py seed_demo
echo.
pause

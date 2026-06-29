# 🏗️ Cuadrilla Maestra

Plataforma web para **ofrecer, buscar y promocionar servicios de construcción,
mantenimiento y remodelación**: gasfitería, electricidad, pintura, albañilería,
instalación de mayólica, remodelaciones, mano de obra general y promoción de
maestros de obra y obreros.

> **Dominio de producción:** [www.cuadrillamaestra.com](https://www.cuadrillamaestra.com)

La página transmite **confianza, seguridad, rapidez, profesionalismo y servicios
verificados**, con un buscador principal, resultados con filtros, perfiles
detallados, proyectos con fotos antes/después, reseñas de clientes y una
**evaluación diferenciada hecha por supervisores de Cuadrilla Maestra**.

---

## 📐 1. Arquitectura general

```
┌──────────────┐     HTTPS/REST     ┌──────────────────┐      ┌──────────────┐
│  React (SPA) │  ───────────────▶  │ Django + DRF API │ ───▶ │  PostgreSQL  │
│  frontend    │  ◀───────────────  │   backend        │      │  base de datos│
└──────────────┘      JSON          └──────────────────┘      └──────────────┘
        │                                   │
        │ Docker                            │ Docker
        └──────────── docker-compose ───────┘
                          │
                  Google Cloud Run + Cloud SQL
                          │
              www.cuadrillamaestra.com (dominio)
```

| Capa          | Tecnología                              |
|---------------|------------------------------------------|
| Frontend      | React 18 (CRA) + MUI Icons + React Router|
| Backend       | Django 5 + Django REST Framework         |
| Autenticación | JWT (SimpleJWT)                          |
| Base de datos | PostgreSQL                               |
| Contenedores  | Docker + Docker Compose                  |
| Despliegue    | Google Cloud Run + Cloud SQL + Cloud Build|
| Repositorio   | GitHub                                   |

---

## 📁 2. Estructura de carpetas

```
cuadrillamaestra/
├── backend/                        # API Django + DRF
│   ├── cuadrillamaestra/           # Configuración del proyecto
│   │   ├── settings.py             # Ajustes (DB, CORS, JWT, REST)
│   │   ├── urls.py                 # Rutas raíz + JWT
│   │   ├── wsgi.py / asgi.py
│   ├── apps/
│   │   ├── accounts/               # Usuario personalizado (roles)
│   │   ├── workers/                # Categoría, Servicio, Obrero/Maestro + búsqueda/filtros
│   │   │   └── management/commands/seed_demo.py
│   │   ├── projects/               # Proyecto + Foto de proyecto
│   │   ├── reviews/                # Reseña de cliente + Evaluación de supervisor
│   │   └── contacts/               # Solicitud de contacto / cotización
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                       # SPA React
│   ├── public/index.html
│   ├── src/
│   │   ├── api/                    # client.js (axios) + endpoints.js
│   │   ├── components/             # Navbar, Footer, WorkerCard, StarRating...
│   │   ├── context/AuthContext.js  # Autenticación JWT
│   │   ├── pages/                  # Home, SearchResults, WorkerDetail...
│   │   ├── utils/constants.js      # Zonas, búsquedas populares, helpers
│   │   ├── App.js                  # Rutas
│   │   └── index.js / index.css    # Tema global (paleta de colores)
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml              # Orquestación local (db + backend + frontend)
├── cloudbuild.yaml                 # CI/CD para Google Cloud
├── .env.example                    # Variables raíz para docker-compose
├── START.bat                       # Arranque rápido (Windows)
└── README.md
```

---

## 🎨 Identidad visual

Paleta inspirada en construcción, confianza y servicios profesionales
(definida con variables CSS en `frontend/src/index.css`):

| Color              | Variable        | Uso                          |
|--------------------|-----------------|------------------------------|
| Azul oscuro        | `--cm-navy`     | Encabezados, navbar, confianza |
| Amarillo construcción | `--cm-yellow` | Botones de acción, acentos   |
| Gris               | `--cm-gray`     | Textos secundarios           |
| Blanco             | `--cm-white`    | Fondos limpios               |
| Negro suave        | `--cm-black`    | Texto principal              |

Tipografías: **Poppins** (títulos) e **Inter** (cuerpo).

---

## 🧱 3. Modelos (Django)

| Modelo                  | App        | Descripción                                              |
|-------------------------|------------|----------------------------------------------------------|
| `User`                  | accounts   | Usuario con rol: cliente, obrero/maestro, supervisor, admin |
| `Category`              | workers    | Oficio: gasfitería, electricidad, pintura...             |
| `Service`               | workers    | Servicio puntual dentro de una categoría                 |
| `Worker`                | workers    | Perfil público del obrero/maestro (datos NO sensibles)   |
| `Project`               | projects   | Proyecto realizado                                       |
| `ProjectPhoto`          | projects   | Foto del proyecto (antes / después / general)            |
| `ClientReview`          | reviews    | Reseña de cliente (1-5★)                                 |
| `SupervisorEvaluation`  | reviews    | Evaluación verificada del supervisor (diferenciada)      |
| `ContactRequest`        | contacts   | Solicitud de contacto o cotización                       |

**Privacidad:** los datos sensibles (DNI, dirección exacta, documentos) viven en
`User.document_number` y solo son visibles en el **panel administrativo** de
Django. Los perfiles públicos exponen únicamente nombre, foto, oficio, zona,
experiencia, servicios, calificación, proyectos y el teléfono/WhatsApp **solo si
el trabajador lo autoriza** (`Worker.show_phone`).

---

## 🔌 4. Endpoints API REST

Base: `/api/`

| Método | Ruta                              | Descripción                                |
|--------|-----------------------------------|--------------------------------------------|
| POST   | `/token/`                         | Login (devuelve access + refresh)          |
| POST   | `/token/refresh/`                 | Refresca el token                          |
| POST   | `/auth/register/`                 | Registro de usuario                        |
| GET/PATCH | `/auth/me/`                    | Perfil del usuario autenticado             |
| GET    | `/categories/`                    | Listar categorías                          |
| GET    | `/services/?category=`            | Listar servicios                           |
| GET    | `/workers/?query=gasfitero`       | **Búsqueda principal**                     |
| GET    | `/workers/?category=&zone=&min_rating=&min_experience=&service=` | **Filtros** |
| GET    | `/workers/{id}/`                  | Detalle completo (proyectos, reseñas, eval)|
| GET    | `/workers/me/`                    | Perfil del trabajador autenticado          |
| GET/POST | `/projects/`                    | Listar / subir proyectos                   |
| POST   | `/project-photos/`                | Subir fotos a un proyecto                  |
| GET/POST | `/reviews/?worker=`             | Reseñas de clientes                        |
| GET/POST | `/supervisor-evaluations/`      | Evaluaciones de supervisores               |
| POST   | `/contact-requests/`              | Crear solicitud de contacto/cotización     |

Ejemplo de búsqueda desde el frontend: el Home redirige a
`/buscar?query=gasfitero`, que consulta `GET /api/workers/?query=gasfitero`.

---

## 🚀 Puesta en marcha

### Opción A — Docker (recomendada)

Requisitos: **Docker Desktop**.

```bash
# 1. Clona el repositorio
git clone https://github.com/<tu-usuario>/cuadrillamaestra.git
cd cuadrillamaestra

# 2. Crea los archivos de entorno
copy backend\.env.example backend\.env      # Windows
cp backend/.env.example backend/.env        # Linux/Mac

# 3. Levanta todo
docker compose up --build
```

En Windows puedes simplemente ejecutar **`START.bat`**.

Servicios:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Admin Django: http://localhost:8000/admin

```bash
# 4. Carga datos de ejemplo (categorías, maestros, proyectos, reseñas)
docker compose exec backend python manage.py seed_demo

# 5. (Opcional) crea tu propio superusuario
docker compose exec backend python manage.py createsuperuser
```

El comando `seed_demo` crea, entre otros:
- Usuario admin → **admin / Admin1234**
- Supervisor → **supervisor / Demo1234**
- 24 maestros/obreros de ejemplo (**workerN / Demo1234**)

### Opción B — Manual (sin Docker)

**Backend**
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate            # Windows
pip install -r requirements.txt
copy .env.example .env
# Edita .env: DB_HOST=localhost y crea la base "cuadrillamaestra" en PostgreSQL
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

**Frontend**
```bash
cd frontend
copy .env.example .env
npm install --legacy-peer-deps
npm start
```

---

## 🗄️ 12. Conexión a PostgreSQL

La conexión se configura por variables de entorno en `backend/.env`:

```env
DB_NAME=cuadrillamaestra
DB_USER=postgres
DB_PASSWORD=admin123
DB_HOST=localhost      # 'db' dentro de docker-compose
DB_PORT=5432
```

Crear la base manualmente (si no usas Docker):
```sql
CREATE DATABASE cuadrillamaestra;
```

---

## 🐳 13. Docker y Docker Compose

- `backend/Dockerfile`: imagen Python 3.11, gunicorn, migraciones automáticas.
- `frontend/Dockerfile`: build de React servido con `serve`.
- `docker-compose.yml`: orquesta `db` (PostgreSQL), `backend` y `frontend`.

Comandos útiles:
```bash
docker compose up --build         # levantar
docker compose down               # detener
docker compose logs -f backend    # ver logs
docker compose exec backend bash  # entrar al contenedor
```

---

## 🔐 14. Variables de entorno (.env)

| Archivo               | Propósito                                    |
|-----------------------|----------------------------------------------|
| `backend/.env`        | SECRET_KEY, DEBUG, base de datos, CORS       |
| `frontend/.env`       | `REACT_APP_API_URL`                          |
| `.env` (raíz)         | Variables para docker-compose                |

Genera una `SECRET_KEY` segura:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

## ☁️ 15. Despliegue en Google Cloud

Usaremos **Cloud Run** (contenedores) + **Cloud SQL** (PostgreSQL) + **Cloud Build** (CI/CD).

```bash
# 0. Configura el proyecto
gcloud config set project TU_PROJECT_ID
gcloud services enable run.googleapis.com sqladmin.googleapis.com \
  cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com

# 1. Repositorio de imágenes
gcloud artifacts repositories create cuadrilla \
  --repository-format=docker --location=us-central1

# 2. Base de datos Cloud SQL (PostgreSQL)
gcloud sql instances create cuadrilla-db --database-version=POSTGRES_16 \
  --tier=db-f1-micro --region=us-central1
gcloud sql databases create cuadrillamaestra --instance=cuadrilla-db
gcloud sql users set-password postgres --instance=cuadrilla-db --password=TU_PASSWORD

# 3. Secretos
echo -n "TU_SECRET_KEY" | gcloud secrets create cuadrilla-secret-key --data-file=-
echo -n "TU_PASSWORD"   | gcloud secrets create cuadrilla-db-password --data-file=-

# 4. Despliega con Cloud Build (usa cloudbuild.yaml)
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_DB_INSTANCE=TU_PROJECT_ID:us-central1:cuadrilla-db
```

En `cloudbuild.yaml` ya se construyen y despliegan **backend** y **frontend** en
Cloud Run, conectando el backend a Cloud SQL vía socket Unix
(`/cloudsql/<instancia>`).

---

## 🌐 16. Conectar el dominio www.cuadrillamaestra.com

1. En **Cloud Run** → servicio `cuadrilla-frontend` → *Manage Custom Domains* →
   *Add Mapping* → `www.cuadrillamaestra.com`.
2. Mapea el backend a `api.cuadrillamaestra.com` del mismo modo.
3. Copia los registros **DNS** (CNAME/A) que entrega Google y agrégalos en tu
   proveedor de dominio.
4. Google emite el **certificado SSL** automáticamente (puede tardar unos minutos).
5. Asegúrate de que en `backend/.env` (producción):
   ```env
   DEBUG=False
   ALLOWED_HOSTS=cuadrillamaestra.com,www.cuadrillamaestra.com,api.cuadrillamaestra.com
   ```
   y en el build del frontend:
   ```
   REACT_APP_API_URL=https://api.cuadrillamaestra.com/api
   ```

Los dominios `cuadrillamaestra.com` y `*.run.app` ya están contemplados en
`CORS_ALLOWED_ORIGINS` y `CSRF_TRUSTED_ORIGINS` dentro de `settings.py`.

---

## 🗺️ Páginas del frontend

| Ruta                     | Página             | Descripción                              |
|--------------------------|--------------------|------------------------------------------|
| `/`                      | Home               | Buscador principal + categorías          |
| `/buscar?query=`         | SearchResults      | Resultados con cards y filtros           |
| `/maestros/:id`          | WorkerDetail       | Perfil completo + proyectos + reseñas    |
| `/servicios/:slug`       | ServiceDetail      | Profesionales de un servicio             |
| `/contacto/:workerId`    | Contact            | Solicitar cotización / contacto          |
| `/subir-proyecto`        | UploadProject      | Subir proyecto con fotos (protegida)     |
| `/login` · `/registro`   | Login / Register   | Autenticación                            |
| `/admin`                 | AdminPanel         | Panel básico (protegido)                 |

---

## ✅ Checklist de funcionalidades

- [x] Buscador principal que redirige a `/buscar?query=`
- [x] Resultados con cards (nombre, foto, oficio, servicios, zona, experiencia, calificación, reseñas, proyectos)
- [x] Filtros: categoría, zona, calificación mínima, años de experiencia, servicio
- [x] Detalle del maestro con galería de proyectos y reseñas
- [x] Subida de proyectos con fotos antes/después
- [x] Reseñas de clientes (1-5★)
- [x] Evaluación del supervisor **diferenciada visualmente**
- [x] Privacidad de datos sensibles (solo en admin)
- [x] Solicitud de contacto / cotización
- [x] Diseño responsive (celular, tablet, escritorio)
- [x] Docker, PostgreSQL, variables de entorno
- [x] Configuración para Google Cloud y dominio

---

© Cuadrilla Maestra — www.cuadrillamaestra.com

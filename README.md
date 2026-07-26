# 🌮 SalTurismo — Plataforma de Turismo y Eventos de Saltillo

> **¡A dónde vamos!?** — Descubre eventos, explora el mapa interactivo y vive la cultura de Saltillo, Coahuila.

---

## 📋 Descripción

**SalTurismo** es una plataforma web que unifica un feed de eventos culturales/sociales y un mapa interactivo de lugares de interés (restaurantes, cafeterías, museos, parques) de la ciudad de Saltillo, México. Incluye moderación de contenido impulsada por IA (Google Gemini) y un sistema de autenticación con roles.

---

## ✨ Funcionalidades Principales

| Módulo | Descripción |
|--------|-------------|
| 🎪 **Carrusel de Eventos** | Feed dinámico de eventos aprobados con filtros por categoría |
| 🗺️ **Mapa Interactivo** | 33 puntos de interés con Leaflet.js, filtros por categoría y geolocalización |
| 🌤️ **Clima en Tiempo Real** | Temperatura actual + pronóstico 3 días (API Open-Meteo) |
| 🔐 **Autenticación** | Login con Email/Password y Google OAuth vía Supabase Auth |
| 🤖 **Moderación IA** | Revisión automática de contenido con Google Gemini antes de publicar |
| ⭐ **Favoritos** | Panel lateral para guardar lugares (localStorage + Supabase) |
| 📅 **Publicar Eventos** | Formulario con moderación IA integrada |
| 🛡️ **Dashboard Admin** | Panel para aprobar/rechazar eventos y gestionar usuarios |
| 🌐 **Bilingüe** | Interfaz ES/EN con cambio dinámico sin recargar |
| 🚨 **Emergencias** | Puntos de emergencia en el mapa + contactos directos |

---

## 🛠️ Tech Stack

### Frontend
- HTML5 + CSS3 (custom, sin frameworks)
- JavaScript ES6+ (vanilla)
- Leaflet.js (mapa interactivo)
- Supabase JS SDK (auth + base de datos)
- FontAwesome 6 (íconos)

### Backend
- Python 3.12 + Flask
- Flask-CORS
- Google Gemini API (moderación vía REST)
- Supabase SDK para Python

### Base de Datos & Auth
- Supabase (PostgreSQL + Auth + RLS)
- Tablas: `profiles`, `events`, `places`, `reviews`, `favorites`

### APIs Externas
- Open-Meteo (clima, sin API key)
- Google Gemini 1.5 Flash (moderación de contenido)
- OpenStreetMap tiles (mapa)

---

## 📁 Estructura del Proyecto

```
SalTurismo/
├── frontend/
│   ├── html/
│   │   ├── index.html          # Página principal (landing)
│   │   ├── login.html          # Inicio de sesión
│   │   ├── register.html       # Registro
│   │   ├── create-event.html   # Formulario de nuevo evento
│   │   └── admin.html          # Dashboard del administrador
│   ├── css/
│   │   └── style.css           # Estilos globales
│   ├── js/
│   │   ├── main.js             # Carrusel, clima, navegación
│   │   ├── map.js              # Mapa Leaflet + marcadores
│   │   ├── auth.js             # Autenticación Supabase
│   │   ├── i18n.js             # Sistema de traducción ES/EN
│   │   ├── create-event.js     # Lógica de crear evento
│   │   └── admin.js            # Lógica del dashboard admin
│   └── images/                 # Assets de imágenes
├── backend/
│   ├── app.py                  # Punto de entrada Flask
│   ├── config.py               # Variables de entorno
│   ├── requirements.txt        # Dependencias Python
│   ├── routes/
│   │   ├── events.py           # CRUD de eventos
│   │   ├── places.py           # Lugares turísticos
│   │   ├── reviews.py          # Reseñas
│   │   ├── admin.py            # Administración
│   │   └── moderate.py         # Moderación con Gemini
│   ├── services/
│   │   ├── supabase_service.py # Cliente Supabase
│   │   └── gemini_service.py   # Servicio de moderación IA
│   └── migrations/
│       └── 002_create_profiles_and_favorites.sql
├── .gitignore
├── README.md
├── steering.md                 # Documento de diseño del proyecto
├── design.md                   # Arquitectura técnica
└── tasks.md                    # Plan de implementación por fases
```

---

## 🚀 Setup Local

### Prerrequisitos
- Python 3.10+
- Navegador moderno (Chrome, Firefox, Edge)
- Cuenta en [Supabase](https://supabase.com)
- API Key de [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/SalTurismo.git
cd SalTurismo
```

### 2. Configurar el Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

### 3. Configurar variables de entorno
Crea `backend/.env`:
```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu_anon_key_aqui
FLASK_ENV=development
GEMINI_API_KEY=tu_gemini_api_key
```

### 4. Configurar Supabase
1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ejecuta el script SQL en el SQL Editor:
   - `backend/migrations/002_create_profiles_and_favorites.sql`
3. Crea las tablas `events`, `places`, `reviews` según el modelo en `design.md`
4. Habilita Google OAuth en Authentication → Providers → Google

### 5. Iniciar el Backend
```bash
cd backend
python app.py
```
El servidor corre en `http://localhost:5000`

### 6. Iniciar el Frontend
Usa Live Server (VS Code) o cualquier servidor estático:
```bash
# Con Python
cd frontend
python -m http.server 5500

# O con Live Server de VS Code apuntando a frontend/html/index.html
```
Accede a `http://127.0.0.1:5500/frontend/html/index.html`

---

## 🔑 Roles de Usuario

| Rol | Permisos |
|-----|----------|
| **Visitante** | Ver eventos, mapa, clima. Sin login. |
| **User** | + Guardar favoritos, publicar eventos (con moderación IA) |
| **Admin** | + Dashboard: aprobar/rechazar eventos, bloquear usuarios |

Para asignar rol admin, actualiza la tabla `profiles` en Supabase:
```sql
UPDATE profiles SET role = 'admin' WHERE id = 'tu-user-uuid';
```

---

## 🌐 API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/events` | Listar eventos (filtros: category, status, q) |
| POST | `/api/v1/events` | Crear evento |
| GET | `/api/v1/places` | Listar lugares |
| GET | `/api/v1/places/:id` | Detalle + reseñas |
| GET | `/api/v1/reviews` | Listar reseñas |
| POST | `/api/v1/reviews` | Crear reseña |
| POST | `/api/v1/moderate` | Moderar contenido con Gemini IA |
| GET | `/api/v1/admin/events/pending` | Eventos pendientes |
| PATCH | `/api/v1/admin/events/:id/status` | Aprobar/rechazar evento |
| GET | `/api/v1/admin/metrics` | Métricas del dashboard |

---

## 🎨 Paleta de Colores

| Variable | Hex | Uso |
|----------|-----|-----|
| `--bg-main` | `#EAE3DC` | Fondo general (beige cantera) |
| `--navy-blue` | `#5FA7A4` | Navbar, headers, textos |
| `--terracotta` | `#F18D4E` | Botones CTA, hero, badges |
| `--card-bg` | `#F8F5F0` | Fondo de tarjetas |
| `--white` | `#FFFFFF` | Texto sobre fondos oscuros |

---

## 📦 Despliegue

### Frontend → Vercel
1. Sube el repositorio a GitHub
2. Conecta el repo en [vercel.com](https://vercel.com)
3. Configura:
   - **Root Directory**: `frontend`
   - **Framework**: Other (Static HTML)
   - **Output Directory**: `.` (raíz de frontend)
4. Actualiza las URLs de redirect en Supabase Auth con el dominio de Vercel

### Backend → Render
1. Conecta el repo en [render.com](https://render.com)
2. Crea un Web Service con:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
3. Agrega las variables de entorno:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `GEMINI_API_KEY`
   - `FLASK_ENV=production`
4. Actualiza la URL del backend en los archivos JS del frontend

---

## 🤝 Contribuir

1. Fork del repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m "feat: descripción del cambio"`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

---

## 👥 Equipo

Desarrollado como proyecto de turismo local para la comunidad de **Saltillo, Coahuila, México**.

---

<p align="center">
  <strong>SalTurismo</strong> — ¡A dónde vamos!? 🌮🗺️
</p>

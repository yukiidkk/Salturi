# Design Document: SALTURI — Plataforma de Turismo y Eventos Saltillo

## Estado actual del frontend

El `index.html` y `style.css` ya implementan la capa visual estática de la página principal:

- **Navbar** con logo, links de navegación y botón "Iniciar Sesión".
- **Carrusel hero** con 3 tarjetas (izquierda, centro destacada, derecha) y puntos indicadores.
- **Sección inferior** con dos bloques: "Explora el Mapa" y "Top Lugares" (3 tarjetas en grid).

Las variables CSS usan colores propios del proyecto (`#5FA7A4` azul-verde, `#F18D4E` terracota, `#EAE3DC` fondo beige). La estructura visual está lista; lo que falta es conectar datos reales, añadir interactividad JavaScript y construir el backend.

---

## Arquitectura General

```
frontend/                      ← HTML5 + Tailwind CSS + JS vanilla
  html/index.html
  css/style.css
  assets/js/
    events.js                  ← Renderizado del carrusel con datos reales
    map.js                     ← Inicialización de Mapbox/Leaflet
    auth.js                    ← Sesión con Supabase Auth

backend/                       ← Python + Flask (API RESTful)
  app.py
  config.py
  routes/
    events.py                  ← CRUD de eventos
    places.py                  ← Lugares del mapa
    reviews.py                 ← Reseñas y calificaciones
    admin.py                   ← Dashboard admin + moderación
  services/
    gemini_service.py          ← Moderación con Google Gemini API
    supabase_service.py        ← Conexión con Supabase

.env                           ← API keys (Supabase, Gemini, Mapbox)
```

---

## Módulos de Diseño

### 1. Feed de Eventos — Carrusel Dinámico

**Estado actual:** HTML estático con imágenes placeholder y títulos hardcodeados.

**Diseño objetivo:**
- `events.js` llama a `GET /api/v1/events` y construye las tarjetas del carrusel dinámicamente.
- Navegación real con flechas (izquierda/derecha) y puntos sincronizados.
- Filtros rápidos encima del carrusel: `Hoy`, `Esta semana`, categorías (Música, Gastronomía, etc.).
- Badges visuales: `Hoy`, `📍 Centro Histórico`, `✔ Verificado`.
- Buscador en tiempo real con debounce.

**API endpoint:**
```
GET /api/v1/events
  ?date=today|week
  &category=musica|gastronomia|...
  &q=<búsqueda>
  → [ { id, title, date, category, image_url, location, verified } ]
```

---

### 2. Mapa Interactivo

**Estado actual:** Placeholder con `<img src="mapa.png">` estático.

**Diseño objetivo:**
- Reemplazar el `<img>` por un `<div id="map">` e inicializar Mapbox GL JS o Leaflet.
- `places.js` llama a `GET /api/v1/places` y pinta marcadores con íconos por categoría.
- Al hacer clic en un marcador: modal/popup con galería, descripción, calificación promedio y botón "¿Cómo llegar?" (link Google Maps).
- Botón "Guardar en Favoritos" (localStorage para visitantes, Supabase para usuarios logueados).

**API endpoint:**
```
GET /api/v1/places
  ?category=restaurante|museo|bar|...
  → [ { id, name, category, lat, lng, image_url, avg_rating } ]

GET /api/v1/places/:id
  → { ...place, description, gallery[], reviews[] }
```

---

### 3. Autenticación y Roles (Supabase Auth)

**Flujo de usuario:**
- El botón "Iniciar Sesión" abre un modal con opciones: Google OAuth o Email/Password.
- `auth.js` maneja la sesión con Supabase Auth JS SDK.
- El rol del usuario (`user`, `organizer`, `admin`) se almacena en la tabla `profiles` de Supabase.
- Las políticas RLS de Supabase controlan qué puede leer/escribir cada rol.

**Roles y permisos:**

| Rol        | Puede hacer                                              |
|------------|----------------------------------------------------------|
| Visitante  | Ver eventos, mapa, reseñas                               |
| User       | + Calificar, comentar, guardar favoritos                 |
| Organizer  | + Enviar solicitud de publicación de evento              |
| Admin      | + Dashboard: aprobar/rechazar eventos, ver métricas      |

---

### 4. Moderación por IA (Google Gemini API)

**Endpoint Flask:**
```
POST /api/v1/moderate
  Body: { type: "comment"|"event", content: "..." }
  → { approved: true|false, reason: "..." }
```

- **Comentarios:** antes de guardarse en Supabase, pasan por este endpoint. Si `approved: false`, se bloquea y se notifica al usuario.
- **Eventos:** el formulario del Organizer llama a este endpoint antes de encolar el evento para revisión del Admin.
- La lógica vive en `gemini_service.py` usando el SDK oficial de Google Generative AI.

---

### 5. Dashboard del Administrador

- Ruta protegida `/admin` (solo rol `admin`).
- Vista con:
  - Eventos pendientes de aprobación (con botones Aprobar / Rechazar).
  - Contador de items moderados por IA en el período.
  - Lista de usuarios reportados.

---

## Modelo de Datos (Supabase / PostgreSQL)

```sql
-- Tabla de perfiles de usuario
profiles (
  id uuid PRIMARY KEY,        -- mismo id de auth.users
  role text,                  -- 'user' | 'organizer' | 'admin'
  display_name text,
  avatar_url text
)

-- Eventos
events (
  id uuid PRIMARY KEY,
  title text,
  description text,
  date date,
  category text,
  location text,
  image_url text,
  verified boolean DEFAULT false,
  status text,                -- 'pending' | 'approved' | 'rejected'
  organizer_id uuid REFERENCES profiles(id)
)

-- Lugares turísticos
places (
  id uuid PRIMARY KEY,
  name text,
  category text,
  lat float,
  lng float,
  description text,
  image_url text
)

-- Reseñas
reviews (
  id uuid PRIMARY KEY,
  place_id uuid REFERENCES places(id),
  user_id uuid REFERENCES profiles(id),
  rating int,                 -- 1-5
  comment text,
  moderated boolean DEFAULT false
)
```

---

## Paleta de colores (variables CSS ya definidas)

| Variable         | Valor     | Uso                              |
|------------------|-----------|----------------------------------|
| `--bg-main`      | `#EAE3DC` | Fondo general                    |
| `--navy-blue`    | `#5FA7A4` | Headers, textos, navbar          |
| `--terracotta`   | `#F18D4E` | Botones, hero, badges, acciones  |
| `--card-bg`      | `#F8F5F0` | Fondo de tarjetas                |
| `--white`        | `#FFFFFF` | Texto sobre fondo oscuro         |

> Nota: el steering original define terracota como `#C85A32` e índigo como `#1B3B6F`. El CSS actual usa variantes más claras. Alinear ambos es una tarea a resolver en la fase de diseño visual.

---

## Decisiones Técnicas

- **Sin framework JS pesado por ahora:** Se usa JavaScript vanilla (ES6+) para mantener la carga ligera. Si el proyecto crece, considerar Vue o React.
- **Tailwind CSS:** Se integrará vía CDN o build step para complementar el CSS personalizado actual.
- **Mapbox vs Leaflet:** Mapbox ofrece mejor experiencia visual; Leaflet es gratuito sin límite de tiles. Decisión pendiente según presupuesto.
- **Cloudinary para imágenes:** Permite transformaciones on-the-fly (resize, webp) sin backend propio.

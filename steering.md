# Steering Document: Plataforma de Turismo y Eventos Saltillo (SALTURI)

## 1. Visión del Proyecto
Desarrollar una plataforma web para la comunidad local y turistas de Saltillo que unifique un **feed de eventos culturales/sociales** y un **mapa interactivo de lugares de interés** (restaurantes, bares, museos, etc.). Incluye moderación de contenido impulsada por Inteligencia Artificial y un sistema de permisos basado en roles.

---

## 2. Paleta de Colores & Diseño de Interfaz (Branding Saltillo)
* **Primario:** Terracota (`#C85A32`) - Inspirado en la alfarería y arquitectura del Centro Histórico.
* **Secundario:** Ocre / Sol (`#E0A96D`) - Para badges de "🔥 Hoy", calificaciones e hitos.
* **Fondo:** Blanco Hueso / Beige Cantera (`#F5F3EF`) - Estilo cálido y legible.
* **Acento:** Azul Índigo (`#1B3B6F`) - Para navegación, headers y detalles de alto contraste.
* **Layout Principal:** Feed superior interactivo tipo banner carrusel deslizable horizontalmente para eventos destacados, seguido por secciones de mapa y navegación superior (Eventos, Turismo, Historia, Contacto, Iniciar Sesión).

---

## 3. Tech Stack & Dependencias
* **Frontend:** HTML5, Tailwind CSS, JavaScript (ES6+).
* **Mapas:** Mapbox GL JS / Leaflet.js con marcadores personalizados por categoría.
* **Backend:** Python con Flask (API RESTful).
* **Base de Datos & Autenticación:** Supabase (PostgreSQL) con políticas RLS para manejo de roles (`User`, `Organizer`, `Admin`).
* **Inteligencia Artificial:** Google Gemini API (vía SDK de Python) para moderación de texto/comentarios y pre-filtrado de solicitudes de eventos.
* **Almacenamiento de Medios:** Cloudinary / Supabase Storage (imágenes de eventos y lugares).

---

## 4. Módulos y Funcionalidades Clave

### A. Feed de Eventos & Exploración (Carrusel / Banner Horizontal)
* Banner de eventos con navegación horizontal deslizable (slider/carrusel).
* Filtros rápidos: `Hoy`, `Esta semana`, `Categoría` (Música, Bazaares, Gastronomía, etc.).
* Badges visuales: `🔥 Hoy`, `📍 Centro Histórico`, `Verificado`.
* Buscador en tiempo real por palabra clave o zona.

### B. Mapa Interactivo de Turismo
* Mapa dinámico con íconos personalizados según la categoría del establecimiento.
* Tarjetas flotantes / Modales interactivos al hacer clic en un marcador:
  * Galería de imágenes y detalles.
  * Reseñas y calificaciones promedio.
  * Botón directo con enlace a Google Maps (`¿Cómo llegar?`).
  * Opción de guardar en "Favoritos" (`localStorage` / Supabase).

### C. Sistema de Usuarios y Roles (`Auth`)
1. **Visitante (Anónimo):** Puede explorar eventos, navegar en el mapa, filtrar y ver reseñas.
2. **Usuario Registrado (`User`):** Login simple (Google / Email). Puede calificar lugares, dejar comentarios y guardar favoritos.
3. **Creador / Organizador (`Organizer`):** Formulario avanzado de solicitud para publicar eventos (Nombre de organización, contacto, detalles del evento, flyer).
4. **Administrador (`Admin`):** Dashboard privado con métricas, contador de elementos moderados por IA y panel de aprobación/rechazo de eventos en 1 clic.

### D. Servicio de Moderación por IA (`Gemini API`)
* Endpoint en Flask (`/api/v1/moderate`):
  * **Comentarios:** Escaneo previo a la publicación para bloquear lenguaje de odio, spam o insultos.
  * **Eventos:** Análisis de la descripción enviada por organizadores para detectar inconsistencias o fraudes antes de pasar a la cola del Administrador.

---

## 5. Guía de Arquitectura de Archivos (Estructura Sugerida)

```text
/
├── backend/
│   ├── app.py                 # Punto de entrada de Flask
│   ├── config.py              # Variables de entorno
│   ├── routes/
│   │   ├── events.py          # Endpoints de eventos
│   │   ├── places.py          # Endpoints de lugares y mapa
│   │   ├── reviews.py         # Endpoints de comentarios
│   │   └── admin.py           # Dashboard y moderación
│   └── services/
│       ├── gemini_service.py  # Integración con Google Gemini SDK
│       └── supabase_service.py# Conexión con Supabase
├── frontend/
│   ├── index.html
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   │       ├── map.js         # Lógica de Mapbox / Leaflet
│   │       ├── events.js      # Rendering del feed / carrusel
│   │       └── auth.js        # Manejo de sesión Supabase
└── .env                       # Credenciales (API Keys)
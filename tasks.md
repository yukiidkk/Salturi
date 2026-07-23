# Tasks: SALTURI — Plan de Implementación

Orden sugerido de desarrollo. Cada tarea es independiente dentro de su fase, pero las fases son secuenciales.

---

## Fase 1 — Frontend Estático (Base ya existente)

- [x] **1.1** Crear estructura de carpetas `frontend/html/` y `frontend/css/`
- [x] **1.2** Construir `index.html` con navbar, carrusel hero (3 tarjetas) y sección inferior (mapa + top lugares)
- [x] **1.3** Crear `style.css` con variables de color, layout de navbar, cards del carrusel y grid de lugares
- [x] **1.4** Alinear paleta de colores entre `style.css` y el branding del steering (paleta unificada en ambos archivos)
- [x] **1.5** Reemplazar imágenes placeholder (`imagen.jpg`, `mapa.png`) por rutas correctas apuntando a `frontend/images/`
- [x] **1.6** Hacer el layout responsivo (mobile-first) con media queries para tablets, móviles y pantallas pequeñas

---

## Fase 2 — Carrusel Dinámico (JavaScript Frontend)

- [ ] **2.1** Crear `frontend/assets/js/events.js`
- [ ] **2.2** Implementar lógica de navegación del carrusel: flechas izquierda/derecha, actualización de puntos indicadores
- [ ] **2.3** Conectar el carrusel a datos mock (array JS local) para probar el render dinámico de tarjetas
- [ ] **2.4** Agregar filtros rápidos (`Hoy`, `Esta semana`, categorías) encima del carrusel
- [ ] **2.5** Implementar buscador en tiempo real con debounce (300ms)
- [ ] **2.6** Añadir badges visuales: `Hoy`, `📍 Centro Histórico`, `✔ Verificado` según los datos del evento

---

## Fase 3 — Mapa Interactivo (JavaScript Frontend)

- [ ] **3.1** Crear `frontend/assets/js/map.js`
- [ ] **3.2** Reemplazar `<img src="mapa.png">` por `<div id="map">` en `index.html`
- [ ] **3.3** Inicializar Mapbox GL JS (o Leaflet.js como alternativa gratuita) centrado en Saltillo
- [ ] **3.4** Cargar marcadores desde datos mock con íconos por categoría (restaurante, museo, bar, etc.)
- [ ] **3.5** Implementar popup/modal al hacer clic en marcador: nombre, imagen, calificación y botón "¿Cómo llegar?"
- [ ] **3.6** Agregar botón "Guardar en Favoritos" que persista en `localStorage`

---

## Fase 4 — Backend Flask (API RESTful)

- [ ] **4.1** Inicializar proyecto Python: `backend/app.py`, `backend/config.py`, `requirements.txt`
- [ ] **4.2** Configurar Flask con CORS habilitado para el frontend
- [ ] **4.3** Implementar `routes/events.py`:
  - `GET /api/v1/events` con filtros `date`, `category`, `q`
  - `POST /api/v1/events` (solo Organizer, requiere token)
- [ ] **4.4** Implementar `routes/places.py`:
  - `GET /api/v1/places` con filtro `category`
  - `GET /api/v1/places/:id` con detalle y reseñas
- [ ] **4.5** Implementar `routes/reviews.py`:
  - `POST /api/v1/reviews` (solo User autenticado)
- [ ] **4.6** Implementar `routes/admin.py`:
  - `GET /api/v1/admin/events/pending`
  - `PATCH /api/v1/admin/events/:id/status` (aprobar/rechazar)
- [ ] **4.7** Crear `services/supabase_service.py` con helpers para CRUD en Supabase

---

## Fase 5 — Base de Datos y Autenticación (Supabase)

- [ ] **5.1** Crear proyecto en Supabase y obtener URL + anon key
- [ ] **5.2** Ejecutar migraciones SQL: tablas `profiles`, `events`, `places`, `reviews`
- [ ] **5.3** Configurar políticas RLS:
  - Visitante: solo lectura en `events` y `places` aprobados
  - User: insertar en `reviews`
  - Organizer: insertar en `events` (estado `pending`)
  - Admin: lectura/escritura total
- [ ] **5.4** Crear `frontend/assets/js/auth.js` con Supabase Auth JS SDK
- [ ] **5.5** Implementar modal de login (Google OAuth + Email/Password)
- [ ] **5.6** Conectar sesión de usuario al frontend: mostrar avatar/nombre en navbar, cambiar botón "Iniciar Sesión" a "Mi Perfil"
- [ ] **5.7** Actualizar "Guardar en Favoritos" para persistir en Supabase si el usuario está logueado

---

## Fase 6 — Moderación por IA (Gemini API)

- [ ] **6.1** Instalar Google Generative AI SDK: `pip install google-generativeai`
- [ ] **6.2** Crear `services/gemini_service.py` con función `moderate_content(type, content) → {approved, reason}`
- [ ] **6.3** Implementar endpoint `POST /api/v1/moderate` en Flask
- [ ] **6.4** Integrar moderación en el flujo de comentarios: llamar antes de guardar en Supabase
- [ ] **6.5** Integrar moderación en el flujo de envío de eventos por Organizer
- [ ] **6.6** Mostrar mensaje de error claro al usuario si su contenido es rechazado

---

## Fase 7 — Dashboard del Administrador

- [ ] **7.1** Crear ruta protegida `/admin` en el frontend (redirige si el rol no es `admin`)
- [ ] **7.2** Diseñar y construir `admin.html` con tabla de eventos pendientes
- [ ] **7.3** Implementar botones "Aprobar" / "Rechazar" que llamen a `PATCH /api/v1/admin/events/:id/status`
- [ ] **7.4** Mostrar contador de items moderados por IA (últimas 24h / semana)
- [ ] **7.5** Añadir sección de usuarios reportados con opción de bloqueo

---

## Fase 8 — Pulido y Despliegue

- [ ] **8.1** Añadir manejo de errores globales en el frontend (toast notifications)
- [ ] **8.2** Optimizar imágenes con Cloudinary (transformaciones webp, resize)
- [ ] **8.3** Configurar variables de entorno en `.env` (nunca subir al repo)
- [ ] **8.4** Agregar `.gitignore` que excluya `.env`, `__pycache__`, `node_modules`
- [ ] **8.5** Escribir `README.md` con instrucciones de setup local
- [ ] **8.6** Desplegar frontend en Vercel o Netlify
- [ ] **8.7** Desplegar backend Flask en Railway o Render
- [ ] **8.8** Configurar variables de entorno en producción

---

## Dependencias entre fases

```
Fase 1 (completada parcialmente)
  └── Fase 2 (carrusel JS)
  └── Fase 3 (mapa JS)
        └── Fase 4 (backend Flask)
              └── Fase 5 (Supabase + Auth)
                    └── Fase 6 (IA Gemini)
                    └── Fase 7 (Dashboard Admin)
                          └── Fase 8 (Despliegue)
```

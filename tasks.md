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
- [x] **1.7** Conectar navegación entre páginas: logo → index.html, btn-login → login.html, enlaces Regístrate/Inicia Sesión cruzados

---

## Fase 2 — Carrusel Dinámico (JavaScript Frontend)

- [x] **2.1** Crear `frontend/js/main.js` con lógica del carrusel, filtros y navegación
- [x] **2.2** Implementar lógica de navegación del carrusel: flechas izquierda/derecha, actualización de puntos indicadores, soporte teclado
- [x] **2.3** Conectar el carrusel a datos mock (array JS local) para probar el render dinámico de tarjetas
- [x] **2.4** Agregar filtros rápidos (Todos, Cultura, Gastronomía, Naturaleza) encima del carrusel
- [x] **2.5** Implementar navegación smooth scroll con IDs de sección y secciones Historia + Contacto (landing page completa)
- [x] **2.6** Añadir sección Historia con highlights y Footer con contacto + redes sociales

---

## Fase 3 — Mapa Interactivo (JavaScript Frontend)

- [x] **3.1** Crear `frontend/js/map.js` con lógica completa del mapa interactivo
- [x] **3.2** Reemplazar imagen estática por `<div id="map">` con Leaflet.js (CDN) en `index.html`
- [x] **3.3** Inicializar Leaflet.js centrado en Saltillo (25.4200, -100.9950) zoom 12 abarcando Norte a Sur
- [x] **3.4** Cargar 28 marcadores con íconos FontAwesome por categoría (museo, cafetería, restaurante, naturaleza) distribuidos Norte/Centro/Sur
- [x] **3.5** Implementar popup al hacer clic en marcador: nombre, zona, descripción y botón "¿Cómo llegar?" (Google Maps)
- [x] **3.6** Agregar botón "Guardar en Favoritos" que persiste en `localStorage` con toast de confirmación
- [x] **3.7** Filtros interactivos del mapa (Todos, Museos, Cafeterías, Restaurantes, Parques, Emergencias) con zoom dinámico a marcadores visibles
- [x] **3.8** Agregar 5 puntos de emergencia (Hospital General, IMSS, Cruz Roja, Bomberos, Comisaría) con pines rojos y filtro dedicado
- [x] **3.9** Crear tarjeta de contactos de emergencia en footer (911, 089, Cruz Roja, Bomberos) con diseño destacado
- [x] **3.10** Implementar sistema de traducción ES/EN (`frontend/js/i18n.js`) con botón en navbar y persistencia en localStorage
- [x] **3.11** Ampliar diccionario i18n con traducciones completas (Historia, highlights, filtros, carrusel, footer) preservando nombres propios
- [x] **3.12** Crear sección Clima en Tiempo Real (#clima) con Open-Meteo API: temperatura actual, sensación térmica, pronóstico 3 días y recomendaciones turísticas dinámicas

---

## Fase 4 — Backend Flask (API RESTful)

- [x] **4.1** Inicializar proyecto Python: `backend/app.py`, `backend/config.py`, `requirements.txt`
- [x] **4.2** Configurar Flask con CORS habilitado para el frontend
- [x] **4.3** Implementar `routes/events.py`:
  - `GET /api/v1/events` con filtros `date`, `category`, `q`
  - `POST /api/v1/events` (solo Organizer, requiere token)
- [x] **4.4** Implementar `routes/places.py`:
  - `GET /api/v1/places` con filtro `category`
  - `GET /api/v1/places/:id` con detalle y reseñas
- [x] **4.5** Implementar `routes/reviews.py`:
  - `POST /api/v1/reviews` (solo User autenticado)
- [x] **4.6** Implementar `routes/admin.py`:
  - `GET /api/v1/admin/events/pending`
  - `PATCH /api/v1/admin/events/:id/status` (aprobar/rechazar)
- [x] **4.7** Crear `services/supabase_service.py` con helpers para CRUD en Supabase

---

## Fase 5 — Base de Datos y Autenticación (Supabase)

- [x] **5.1** Crear proyecto en Supabase y obtener URL + anon key
- [x] **5.2** Ejecutar migraciones SQL: tablas `profiles`, `events`, `places`, `reviews`
- [x] **5.3** Configurar políticas RLS:
  - Visitante: solo lectura en `events` y `places` aprobados
  - User: insertar en `reviews`
  - Organizer: insertar en `events` (estado `pending`)
  - Admin: lectura/escritura total
- [x] **5.4** Crear `frontend/js/auth.js` con Supabase Auth JS SDK (CDN @supabase/supabase-js@2)
- [x] **5.5** Implementar formularios de login y registro conectados a Supabase Auth (Email/Password + Google OAuth)
- [x] **5.6** Conectar sesión de usuario al frontend: mostrar nombre en navbar, menú desplegable (Perfil, Favoritos, Cerrar Sesión)
- [x] **5.7** Actualizar "Guardar en Favoritos" para persistir en Supabase si el usuario está logueado

---

## Fase 6 — Moderación por IA (Gemini API)

- [x] **6.1** Instalar Google Generative AI SDK (+ implementación con requests REST directo por incompatibilidad SSL/gRPC en Windows)
- [x] **6.2** Crear `services/gemini_service.py` con función `moderate_content(type, content) → {approved, reason}`
- [x] **6.3** Implementar endpoint `POST /api/v1/moderate` en Flask (blueprint registrado en app.py)
- [ ] **6.4** Integrar moderación en el flujo de comentarios: llamar antes de guardar en Supabase
- [x] **6.5** Integrar moderación en el flujo de envío de eventos por Organizer (`create-event.js`)
- [x] **6.6** Mostrar mensaje de error claro al usuario si su contenido es rechazado

---

## Fase 7 — Dashboard del Administrador

- [x] **7.1** Crear ruta protegida `/admin` en el frontend (redirige si el rol no es `admin`)
- [x] **7.2** Diseñar y construir `admin.html` con tabla de eventos pendientes
- [x] **7.3** Implementar botones "Aprobar" / "Rechazar" que llamen a `PATCH /api/v1/admin/events/:id/status`
- [x] **7.4** Mostrar contador de items moderados por IA (últimas 24h / semana)
- [x] **7.5** Añadir sección de usuarios reportados con opción de bloqueo

---

## Fase 8 — Pulido y Despliegue

- [x] **8.1** Añadir manejo de errores globales en el frontend (toast notifications)
- [ ] **8.2** Optimizar imágenes con Cloudinary (transformaciones webp, resize)
- [x] **8.3** Configurar variables de entorno en `.env` (nunca subir al repo)
- [x] **8.4** Agregar `.gitignore` que excluya `.env`, `__pycache__`, `node_modules`
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

/**
 * SALTURI — create-event.js
 * Script independiente para la página de solicitud de evento.
 * No depende de main.js ni auth.js.
 */

// ============================================
// CONFIGURACIÓN
// ============================================
const SUPABASE_URL = 'https://chiuumbnfnpidhqkqbnl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_RhMSfdU_Q7BeykB-3XMiVQ_zTYsz5o1';
const MODERATION_API = 'http://localhost:5000/api/v1/moderate';

let sbClient = null;
let user = null;

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Inicializar Supabase
        if (typeof supabase !== 'undefined' && supabase.createClient) {
            sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        }

        // Verificar sesión — redirigir si no hay usuario
        if (sbClient) {
            const { data: { session } } = await sbClient.auth.getSession();
            if (session && session.user) {
                user = session.user;
                updateNavForUser();
            } else {
                // No autenticado — redirigir
                window.location.href = 'index.html';
                return;
            }
        } else {
            window.location.href = 'index.html';
            return;
        }

        // Conectar formulario
        const form = document.getElementById('create-event-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                handleSubmit();
            });
        }
    } catch (err) {
        console.warn('create-event init error:', err);
        window.location.href = 'index.html';
    }
});

// ============================================
// ACTUALIZAR NAV PARA USUARIO LOGUEADO
// ============================================
function updateNavForUser() {
    const btn = document.querySelector('.btn-login');
    if (!btn || !user) return;
    const name = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Mi Perfil';
    btn.textContent = '👤 ' + name;
    btn.removeAttribute('onclick');
    btn.classList.add('btn-user-logged');
}

// ============================================
// ENVIAR EVENTO
// ============================================
async function handleSubmit() {
    const title = document.getElementById('event-title')?.value?.trim() || '';
    const category = document.getElementById('event-category')?.value || '';
    const eventDate = document.getElementById('event-date')?.value || '';
    const description = document.getElementById('event-description')?.value?.trim() || '';
    const location = document.getElementById('event-location')?.value?.trim() || '';
    const imageUrl = document.getElementById('event-image')?.value?.trim() || '';
    const msgEl = document.getElementById('event-form-message');
    const btn = document.querySelector('.btn-submit-event');

    // Validar campos obligatorios
    if (!title || !category || !description || !location) {
        showMsg(msgEl, 'Por favor, completa todos los campos obligatorios (*).', 'error');
        return;
    }

    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Moderando con IA...'; }

    // PASO 1: Moderar contenido
    let modResult = { approved: true, reason: '' };
    try {
        const res = await fetch(MODERATION_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'event', content: title + '. ' + description })
        });
        if (res.ok) modResult = await res.json();
    } catch (e) {
        console.warn('Moderation service unavailable, approving by default');
    }

    if (!modResult.approved) {
        showMsg(msgEl, '❌ Solicitud rechazada: ' + modResult.reason, 'error');
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Solicitud'; }
        return;
    }

    // PASO 2: Guardar en Supabase con status explícito 'approved'
    if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';

    try {
        const eventData = {
            title: title,
            category: category,
            description: description,
            location: location,
            status: 'approved',
            organizer_id: user.id
        };
        if (eventDate) eventData.event_date = eventDate;
        if (imageUrl) eventData.image_url = imageUrl;

        const { error } = await sbClient.from('events').insert(eventData);

        if (error) {
            showMsg(msgEl, '❌ Error al guardar: ' + error.message, 'error');
        } else {
            showMsg(msgEl, '✅ ¡Evento publicado exitosamente!', 'success');
            document.getElementById('create-event-form').reset();
            setTimeout(() => { window.location.href = 'index.html'; }, 2000);
        }
    } catch (err) {
        showMsg(msgEl, '❌ Error inesperado: ' + err.message, 'error');
    }

    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Solicitud'; }
}

// ============================================
// UTILIDAD: Mensajes
// ============================================
function showMsg(el, message, type) {
    if (!el) return;
    el.className = 'form-message form-message-' + type;
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => { if (el) el.style.display = 'none'; }, 6000);
}

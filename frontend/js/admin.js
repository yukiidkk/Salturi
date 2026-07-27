/**
 * SALTURI — admin.js
 * Script independiente para el Dashboard de Administración.
 * Valida rol admin, carga eventos pendientes, acciones de moderación.
 */

const SUPABASE_URL = (typeof APP_CONFIG !== 'undefined') ? APP_CONFIG.SUPABASE_URL : 'https://chiuumbnfnpidhqkqbnl.supabase.co';
const SUPABASE_ANON_KEY = (typeof APP_CONFIG !== 'undefined') ? APP_CONFIG.SUPABASE_ANON_KEY : 'sb_publishable_RhMSfdU_Q7BeykB-3XMiVQ_zTYsz5o1';
const API_BASE = (typeof APP_CONFIG !== 'undefined') ? APP_CONFIG.API_BASE : 'https://salturi.onrender.com/api/v1';

let sbClient = null;
let adminUser = null;

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        if (typeof supabase !== 'undefined' && supabase.createClient) {
            sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        }

        if (!sbClient) { window.location.href = 'index.html'; return; }

        // Verificar sesión
        const { data: { session } } = await sbClient.auth.getSession();
        if (!session || !session.user) {
            window.location.href = 'login.html';
            return;
        }

        adminUser = session.user;

        // Verificar rol admin en tabla profiles
        const { data: profile } = await sbClient
            .from('profiles')
            .select('role')
            .eq('id', adminUser.id)
            .single();

        if (!profile || profile.role !== 'admin') {
            alert('Acceso denegado. Solo administradores pueden ver esta página.');
            window.location.href = 'index.html';
            return;
        }

        // Actualizar UI con nombre de admin
        const btn = document.getElementById('admin-user-btn');
        if (btn) btn.textContent = '👤 ' + (adminUser.user_metadata?.display_name || adminUser.email?.split('@')[0]);

        // Cargar datos
        await loadPendingEvents();
        await loadMetrics();
        await loadReportedUsers();

    } catch (err) {
        console.error('Admin init error:', err);
        window.location.href = 'index.html';
    }
});

// ============================================
// CARGAR EVENTOS PENDIENTES
// ============================================
async function loadPendingEvents() {
    try {
        const { data, error } = await sbClient
            .from('events')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        const tbody = document.getElementById('pending-events-body');
        if (!tbody) return;

        if (error || !data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="table-empty">No hay eventos pendientes 🎉</td></tr>';
            updateMetric('metric-pending', 0);
            return;
        }

        updateMetric('metric-pending', data.length);

        tbody.innerHTML = data.map(ev => `
            <tr id="event-row-${ev.id}">
                <td><strong>${ev.title || 'Sin título'}</strong><br><small class="text-muted">${(ev.description || '').substring(0, 60)}...</small></td>
                <td><span class="badge badge-category">${ev.category || '—'}</span></td>
                <td>${ev.event_date || '—'}</td>
                <td>${ev.location || '—'}</td>
                <td class="actions-cell">
                    <button class="btn-action btn-approve" onclick="approveEvent('${ev.id}')">
                        <i class="fa-solid fa-check"></i> Aprobar
                    </button>
                    <button class="btn-action btn-reject" onclick="rejectEvent('${ev.id}')">
                        <i class="fa-solid fa-xmark"></i> Rechazar
                    </button>
                </td>
            </tr>
        `).join('');

    } catch (err) {
        console.error('loadPendingEvents error:', err);
    }
}

// ============================================
// APROBAR / RECHAZAR EVENTO
// ============================================
async function approveEvent(eventId) {
    try {
        const res = await fetch(`${API_BASE}/admin/events/${eventId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'approved' })
        });

        if (res.ok) {
            removeEventRow(eventId);
            showAdminToast('✅ Evento aprobado');
        } else {
            const err = await res.json();
            showAdminToast('❌ Error: ' + (err.error || 'desconocido'));
        }
    } catch (e) {
        console.error('approveEvent error:', e);
        showAdminToast('❌ Error de conexión');
    }
}

async function rejectEvent(eventId) {
    if (!confirm('¿Estás seguro de rechazar este evento?')) return;

    try {
        const res = await fetch(`${API_BASE}/admin/events/${eventId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'rejected' })
        });

        if (res.ok) {
            removeEventRow(eventId);
            showAdminToast('🗑️ Evento rechazado');
        } else {
            const err = await res.json();
            showAdminToast('❌ Error: ' + (err.error || 'desconocido'));
        }
    } catch (e) {
        console.error('rejectEvent error:', e);
        showAdminToast('❌ Error de conexión');
    }
}

function removeEventRow(eventId) {
    const row = document.getElementById(`event-row-${eventId}`);
    if (row) {
        row.style.opacity = '0';
        setTimeout(() => {
            row.remove();
            // Verificar si la tabla quedó vacía
            const tbody = document.getElementById('pending-events-body');
            if (tbody && tbody.children.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="table-empty">No hay eventos pendientes 🎉</td></tr>';
            }
            // Decrementar métrica
            const el = document.getElementById('metric-pending');
            if (el) el.textContent = Math.max(0, parseInt(el.textContent || '0') - 1);
        }, 300);
    }
}

// ============================================
// MÉTRICAS
// ============================================
async function loadMetrics() {
    try {
        // Eventos aprobados
        const { count: approvedCount } = await sbClient
            .from('events')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'approved');

        updateMetric('metric-approved', approvedCount || 0);

        // Moderados últimas 24h (eventos creados ayer o hoy)
        const yesterday = new Date(Date.now() - 86400000).toISOString();
        const { count: mod24h } = await sbClient
            .from('events')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', yesterday);

        updateMetric('metric-moderated-24h', mod24h || 0);

        // Moderados última semana
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
        const { count: modWeek } = await sbClient
            .from('events')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', weekAgo);

        updateMetric('metric-moderated-week', modWeek || 0);

    } catch (err) {
        console.warn('loadMetrics error:', err);
    }
}

function updateMetric(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// ============================================
// USUARIOS REPORTADOS
// ============================================
async function loadReportedUsers() {
    try {
        // Buscar perfiles con rol bloqueado o reportados
        const { data, error } = await sbClient
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        const tbody = document.getElementById('reported-users-body');
        if (!tbody) return;

        if (error || !data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="table-empty">Sin usuarios registrados</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(u => `
            <tr id="user-row-${u.id}">
                <td>${u.id.substring(0, 8)}...</td>
                <td>${u.full_name || '—'}</td>
                <td><span class="badge badge-role badge-${u.role}">${u.role}</span></td>
                <td class="actions-cell">
                    ${u.role !== 'admin' ? `
                        <button class="btn-action btn-block" onclick="blockUser('${u.id}')">
                            <i class="fa-solid fa-ban"></i> Bloquear
                        </button>
                    ` : '<span class="text-muted">—</span>'}
                </td>
            </tr>
        `).join('');

    } catch (err) {
        console.warn('loadReportedUsers error:', err);
    }
}

async function blockUser(userId) {
    if (!confirm('¿Bloquear a este usuario? Se cambiará su rol a "blocked".')) return;

    try {
        const { error } = await sbClient
            .from('profiles')
            .update({ role: 'blocked' })
            .eq('id', userId);

        if (!error) {
            showAdminToast('🚫 Usuario bloqueado');
            await loadReportedUsers(); // Recargar tabla
        } else {
            showAdminToast('❌ Error: ' + error.message);
        }
    } catch (e) {
        console.error('blockUser error:', e);
    }
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showAdminToast(message) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification toast-visible';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

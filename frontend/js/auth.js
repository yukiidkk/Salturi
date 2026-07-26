/**
 * SALTURI — auth.js
 * Autenticación, menú de usuario, y panel de favoritos con Supabase
 */

// ============================================
// CONFIGURACIÓN SUPABASE
// ============================================
const SUPABASE_URL = 'https://chiuumbnfnpidhqkqbnl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_RhMSfdU_Q7BeykB-3XMiVQ_zTYsz5o1';

let supabaseClient;
let currentUser = null;

function initSupabase() {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
}

// ============================================
// SESIÓN
// ============================================
async function checkSession() {
    if (!supabaseClient) return null;
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session && session.user) {
            currentUser = session.user;
            renderUserNavbar();
            return currentUser;
        }
    } catch (e) {
        console.warn('Auth session check error:', e);
    }
    return null;
}

/** Llamada pública para i18n — re-aplica el estado de auth en navbar */
function reapplyAuthState() {
    if (currentUser) {
        renderUserNavbar();
    }
}

// ============================================
// LOGIN
// ============================================
async function loginWithEmail(email, password) {
    if (!supabaseClient) return { error: 'Supabase no inicializado' };
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        currentUser = data.user;
        renderUserNavbar();
        return { data: data.user };
    } catch (e) {
        return { error: e.message };
    }
}

async function registerWithEmail(email, password, fullName) {
    if (!supabaseClient) return { error: 'Supabase no inicializado' };
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email, password,
            options: { data: { display_name: fullName } }
        });
        if (error) return { error: error.message };
        return { data: data.user, message: 'Cuenta creada. Revisa tu correo para confirmar.' };
    } catch (e) {
        return { error: e.message };
    }
}

async function loginWithGoogle() {
    if (!supabaseClient) {
        console.error('loginWithGoogle: Supabase no inicializado');
        return { error: 'Supabase no inicializado' };
    }
    try {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: 'http://127.0.0.1:5500/frontend/html/index.html' }
        });
        if (error) {
            console.error('loginWithGoogle error:', error.message);
            return { error: error.message };
        }
        return { data };
    } catch (e) {
        console.error('loginWithGoogle exception:', e);
        return { error: e.message };
    }
}

async function logout() {
    if (supabaseClient) {
        try { await supabaseClient.auth.signOut(); } catch (e) { /* ignore */ }
    }
    currentUser = null;
    renderLogoutNavbar();
}

// ============================================
// NAVBAR — USUARIO LOGUEADO
// ============================================
function renderUserNavbar() {
    const btnLogin = document.querySelector('.btn-login');
    if (!btnLogin || !currentUser) return;

    const displayName = currentUser.user_metadata?.display_name
        || currentUser.email?.split('@')[0]
        || 'Mi Perfil';

    // Crear nuevo botón limpio (elimina listeners previos)
    const newBtn = document.createElement('button');
    newBtn.type = 'button';
    newBtn.className = 'btn-login btn-user-logged';
    newBtn.innerHTML = `<i class="fa-solid fa-user-circle"></i> ${displayName}`;
    // NO tiene data-i18n para que i18n no lo sobreescriba
    btnLogin.parentNode.replaceChild(newBtn, btnLogin);

    // Click abre/cierra menú desplegable
    newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleUserMenu();
    });

    // Crear menú si no existe
    createUserMenu(newBtn);

    // Mostrar botón de favoritos y FAB
    showFavoritesButton();
    const fab = document.getElementById('btn-create-event');
    if (fab) fab.classList.add('auth-visible');
}

function createUserMenu(anchorBtn) {
    // Remover menú anterior si existe
    const existing = document.querySelector('.user-menu');
    if (existing) existing.remove();

    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-header">
            <span class="user-menu-email">${currentUser.email || ''}</span>
        </div>
        <a href="create-event.html" class="user-menu-item" data-action="create-event">
            <i class="fa-solid fa-calendar-plus"></i> Solicitar Evento
        </a>
        <a href="#" class="user-menu-item" data-action="favorites">
            <i class="fa-solid fa-heart"></i> Mis Favoritos
        </a>
        <a href="#" class="user-menu-item user-menu-logout" data-action="logout">
            <i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
        </a>
    `;

    // Posicionar relativo al padre
    anchorBtn.parentElement.style.position = 'relative';
    anchorBtn.parentElement.appendChild(menu);

    // Event delegation en el menú
    menu.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const item = e.target.closest('[data-action]');
        if (!item) return;

        const action = item.dataset.action;
        menu.classList.remove('user-menu-visible');

        if (action === 'logout') {
            logout();
            window.location.href = 'index.html';
        } else if (action === 'favorites') {
            openFavoritesPanel();
        } else if (action === 'create-event') {
            window.location.href = 'create-event.html';
        }
    });

    // Cerrar menú al clic fuera
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !anchorBtn.contains(e.target)) {
            menu.classList.remove('user-menu-visible');
        }
    });
}

function renderLogoutNavbar() {
    // Remover menú
    const menu = document.querySelector('.user-menu');
    if (menu) menu.remove();

    // Restaurar botón de login
    const btnLogged = document.querySelector('.btn-user-logged');
    if (!btnLogged) return;

    const newBtn = document.createElement('button');
    newBtn.type = 'button';
    newBtn.className = 'btn-login';
    newBtn.setAttribute('data-i18n', 'login');
    newBtn.textContent = (typeof t === 'function') ? t('login') : 'Iniciar Sesión';
    newBtn.setAttribute('onclick', "window.location.href='login.html'");
    btnLogged.parentNode.replaceChild(newBtn, btnLogged);

    // Ocultar botón de favoritos y FAB
    hideFavoritesButton();
    const fab = document.getElementById('btn-create-event');
    if (fab) fab.classList.remove('auth-visible');
}

function toggleUserMenu() {
    const menu = document.querySelector('.user-menu');
    if (menu) menu.classList.toggle('user-menu-visible');
}

// ============================================
// PANEL LATERAL DE FAVORITOS
// ============================================
function openFavoritesPanel() {
    const panel = document.getElementById('favorites-panel');
    const overlay = document.getElementById('favorites-overlay');
    if (panel) panel.classList.add('favorites-panel-open');
    if (overlay) overlay.classList.add('favorites-overlay-visible');
    renderFavoritesList();
}

function closeFavoritesPanel() {
    const panel = document.getElementById('favorites-panel');
    const overlay = document.getElementById('favorites-overlay');
    if (panel) panel.classList.remove('favorites-panel-open');
    if (overlay) overlay.classList.remove('favorites-overlay-visible');
}

function renderFavoritesList() {
    const listEl = document.getElementById('favorites-list');
    const emptyEl = document.getElementById('favorites-empty');
    if (!listEl || !emptyEl) return;

    const favorites = JSON.parse(localStorage.getItem('salturi_favorites') || '[]');

    if (favorites.length === 0) {
        listEl.innerHTML = '';
        emptyEl.classList.add('favorites-empty-visible');
        return;
    }

    emptyEl.classList.remove('favorites-empty-visible');

    let html = '';
    favorites.forEach(fav => {
        const lugar = (typeof lugaresData !== 'undefined')
            ? lugaresData.find(l => l.id === fav.id)
            : null;

        const catConfig = lugar && (typeof CATEGORIAS !== 'undefined')
            ? CATEGORIAS[lugar.category] || { color: '#5FA7A4', icon: 'fa-map-pin' }
            : { color: '#5FA7A4', icon: 'fa-map-pin' };

        const categoryLabel = lugar ? (lugar.category || '') : '';

        html += `
            <div class="fav-card" data-fav-id="${fav.id}" onclick="focusFavoriteOnMap(${fav.id})">
                <div class="fav-card-icon" style="background-color: ${catConfig.color};">
                    <i class="fa-solid ${catConfig.icon}"></i>
                </div>
                <div class="fav-card-info">
                    <div class="fav-card-name">${fav.name}</div>
                    <div class="fav-card-category">${categoryLabel}</div>
                </div>
                <button type="button" class="fav-card-delete" onclick="event.stopPropagation(); removeFavoriteFromPanel(${fav.id}, '${fav.name.replace(/'/g, "\\'")}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    });

    listEl.innerHTML = html;
}

function focusFavoriteOnMap(placeId) {
    if (typeof lugaresData === 'undefined' || typeof map === 'undefined') return;
    const lugar = lugaresData.find(l => l.id === placeId);
    if (lugar) {
        closeFavoritesPanel();
        const mapSection = document.getElementById('turismo');
        if (mapSection) mapSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            map.flyTo([lugar.lat, lugar.lng], 15, { duration: 1.2 });
        }, 500);
    }
}

async function removeFavoriteFromPanel(placeId, placeName) {
    // Remover de localStorage
    let favorites = JSON.parse(localStorage.getItem('salturi_favorites') || '[]');
    favorites = favorites.filter(f => f.id !== placeId);
    localStorage.setItem('salturi_favorites', JSON.stringify(favorites));

    // Remover de Supabase si hay sesión
    if (supabaseClient && currentUser) {
        try {
            await supabaseClient.from('favorites').delete()
                .eq('user_id', currentUser.id)
                .eq('place_id', placeId);
        } catch (e) { /* fallback silencioso */ }
    }

    renderFavoritesList();
    if (typeof showToast === 'function') {
        showToast(`${placeName} eliminado de favoritos`);
    }
}

// ============================================
// FAVORITOS — Guardar/Quitar (llamado desde map.js)
// ============================================
async function saveFavoriteToSupabase(placeId, placeName) {
    if (!supabaseClient || !currentUser) return false;
    try {
        await supabaseClient.from('favorites').upsert({
            user_id: currentUser.id,
            place_id: placeId,
            place_name: placeName
        }, { onConflict: 'user_id,place_id' });
        return true;
    } catch (e) {
        console.warn('Favorites save fallback to localStorage');
        return false;
    }
}

async function removeFavoriteFromSupabase(placeId) {
    if (!supabaseClient || !currentUser) return false;
    try {
        await supabaseClient.from('favorites').delete()
            .eq('user_id', currentUser.id)
            .eq('place_id', placeId);
        return true;
    } catch (e) {
        return false;
    }
}

// ============================================
// FORMULARIO LOGIN (login.html)
// ============================================
function initLoginForm() {
    const form = document.querySelector('.login-form');
    if (!form) return;

    const submitBtn = form.querySelector('.btn-submit');
    if (!submitBtn || submitBtn.textContent.trim() === 'Registrarse') return;

    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]')?.value;
        const password = form.querySelector('input[type="password"]')?.value;

        if (!email || !password) {
            showAuthMessage('Por favor, completa todos los campos.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Entrando...';

        const result = await loginWithEmail(email, password);
        if (result.error) {
            showAuthMessage(result.error, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Entrar';
        } else {
            showAuthMessage('¡Bienvenido!', 'success');
            setTimeout(() => { window.location.href = 'index.html'; }, 1000);
        }
    });

    // Google
    const socialBtns = form.querySelectorAll('.btn-social');
    socialBtns.forEach(btn => {
        if (btn.textContent.includes('Google')) {
            btn.addEventListener('click', (e) => { e.preventDefault(); loginWithGoogle(); });
        }
    });
}

// ============================================
// FORMULARIO REGISTRO (register.html)
// ============================================
function initRegisterForm() {
    const form = document.querySelector('.login-form');
    if (!form) return;

    const submitBtn = form.querySelector('.btn-submit');
    if (!submitBtn || submitBtn.textContent.trim() !== 'Registrarse') return;

    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const inputs = form.querySelectorAll('input');
        const fullName = inputs[0]?.value;
        const email = inputs[1]?.value;
        const password = inputs[2]?.value;
        const confirmPassword = inputs[3]?.value;

        if (!fullName || !email || !password || !confirmPassword) {
            showAuthMessage('Por favor, completa todos los campos.', 'error');
            return;
        }
        if (password !== confirmPassword) {
            showAuthMessage('Las contraseñas no coinciden.', 'error');
            return;
        }
        if (password.length < 6) {
            showAuthMessage('La contraseña debe tener al menos 6 caracteres.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Creando cuenta...';

        const result = await registerWithEmail(email, password, fullName);
        if (result.error) {
            showAuthMessage(result.error, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Registrarse';
        } else {
            showAuthMessage(result.message || '¡Cuenta creada!', 'success');
            setTimeout(() => { window.location.href = 'login.html'; }, 2000);
        }
    });

    // Google
    const socialBtns = form.querySelectorAll('.btn-social');
    socialBtns.forEach(btn => {
        if (btn.textContent.includes('Google')) {
            btn.addEventListener('click', (e) => { e.preventDefault(); loginWithGoogle(); });
        }
    });
}

// ============================================
// UTILIDADES UI
// ============================================
function showAuthMessage(message, type) {
    const existing = document.querySelector('.auth-message');
    if (existing) existing.remove();

    const msgEl = document.createElement('div');
    msgEl.className = `auth-message auth-message-${type}`;
    msgEl.textContent = message;

    const form = document.querySelector('.login-form');
    if (form) {
        form.insertBefore(msgEl, form.firstChild);
        setTimeout(() => msgEl.remove(), 4000);
    }
}

function initPasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                toggle.classList.replace('fa-eye-slash', 'fa-eye');
            } else {
                input.type = 'password';
                toggle.classList.replace('fa-eye', 'fa-eye-slash');
            }
        });
    });
}

function showFavoritesButton() {
    const btn = document.getElementById('btn-favorites-star');
    if (btn) btn.classList.add('auth-visible');
}

function hideFavoritesButton() {
    const btn = document.getElementById('btn-favorites-star');
    if (btn) btn.classList.remove('auth-visible');
}

function initFavoritesPanel() {
    const btnStar = document.getElementById('btn-favorites-star');
    const btnClose = document.getElementById('btn-close-favorites');
    const overlay = document.getElementById('favorites-overlay');

    if (btnStar) btnStar.addEventListener('click', openFavoritesPanel);
    if (btnClose) btnClose.addEventListener('click', closeFavoritesPanel);
    if (overlay) overlay.addEventListener('click', closeFavoritesPanel);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeFavoritesPanel();
    });
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
    checkSession();
    initAuthStateListener();
    initLoginForm();
    initRegisterForm();
    initGoogleButtons();
    initPasswordToggle();
    initFavoritesPanel();
});

// ============================================
// LISTENER DE CAMBIO DE ESTADO DE AUTH
// ============================================
function initAuthStateListener() {
    if (!supabaseClient) return;
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session && session.user) {
            currentUser = session.user;
            renderUserNavbar();
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            renderLogoutNavbar();
        }
    });
}

// ============================================
// VINCULAR BOTONES DE GOOGLE
// ============================================
function initGoogleButtons() {
    const googleBtn = document.getElementById('btn-google-login');
    if (googleBtn) {
        googleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginWithGoogle();
        });
    }
}

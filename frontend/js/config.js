/**
 * SALTURI — config.js
 * Configuración central del frontend.
 * Detecta automáticamente si está en localhost o en producción.
 */

const APP_CONFIG = (() => {
    const isLocal = window.location.hostname === '127.0.0.1'
        || window.location.hostname === 'localhost';

    return {
        // URL del backend Flask
        API_BASE: isLocal
            ? 'http://localhost:5000/api/v1'
            : 'https://salturi.onrender.com/api/v1',

        // URL de Supabase
        SUPABASE_URL: 'https://chiuumbnfnpidhqkqbnl.supabase.co',
        SUPABASE_ANON_KEY: 'sb_publishable_RhMSfdU_Q7BeykB-3XMiVQ_zTYsz5o1',

        // Redirect para OAuth
        AUTH_REDIRECT: isLocal
            ? 'http://127.0.0.1:5500/frontend/html/index.html'
            : 'https://salturi.vercel.app/html/index.html',

        IS_LOCAL: isLocal
    };
})();

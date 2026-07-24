/**
 * SALTURI — i18n.js
 * Sistema de traducción completo Español / Inglés
 * REGLA: Los nombres propios de lugares, eventos, plazas y calles NUNCA se traducen.
 */

const translations = {
    es: {
        // Navbar
        nav_eventos: "Eventos",
        nav_turismo: "Turismo",
        nav_historia: "Historia",
        nav_contacto: "Contacto",
        login: "Iniciar Sesión",

        // Filtros de eventos (carrusel)
        cat_all: "Todos",
        cat_culture: "Cultura",
        cat_gastro: "Gastronomía",
        cat_nature: "Naturaleza",

        // Mapa
        map_title: "Explora el Mapa",
        filter_all: "Todos",
        filter_museums: "Museos y Cultura",
        filter_cafes: "Cafeterías",
        filter_restaurants: "Restaurantes y Bares",
        filter_parks: "Parques y Naturaleza",
        filter_emergency: "Emergencias",

        // Sección Historia
        historia_title: "Historia y Cultura de Saltillo",
        historia_p1: "Fundada en 1577, Santiago de Saltillo es una de las ciudades más antiguas del norte de México. Su Centro Histórico alberga joyas arquitectónicas como la Catedral de Santiago, construida en estilo barroco churrigueresco durante el siglo XVIII.",
        historia_p2: "Saltillo es reconocida por su tradición artesanal en sarapes, su gastronomía norteña y su riqueza cultural que mezcla influencias indígenas tlaxcaltecas con la herencia colonial española.",
        historia_p3: "Hoy, la ciudad es un polo educativo y cultural del noreste, con museos de clase mundial como el Museo del Desierto y el Museo de las Aves de México, además de una vibrante escena de eventos y festivales durante todo el año.",
        highlight_history: "de historia",
        highlight_museums: "para explorar",
        highlight_events: "al año",

        // Clima
        weather_title: "Clima Actual en Saltillo",
        weather_loading: "Cargando clima...",
        weather_feels: "Sensación térmica",
        weather_wind: "Viento",
        weather_tip: "Recomendación",
        weather_forecast_title: "Próximos 3 días",
        weather_max: "Máx",
        weather_min: "Mín",

        // Carrusel - Botones
        btn_view_event: "Ver Evento",

        // Favoritos panel
        fav_title: "Mis Favoritos",
        fav_empty: "Aún no tienes favoritos. Explora el mapa y guarda los lugares que más te gusten.",

        // Emergencias
        emergency_title: "🚨 Contactos de Emergencia — Saltillo",
        emergency_general: "Emergencias Generales",
        emergency_report: "Denuncia Anónima",
        emergency_redcross: "Cruz Roja Saltillo",
        emergency_fire: "Bomberos Saltillo",

        // Footer
        footer_desc: "Tu plataforma para descubrir eventos, turismo y la cultura de Saltillo, Coahuila.",
        footer_nav: "Navegación",
        footer_contact: "Contacto",
        footer_follow: "Síguenos",
        footer_rights: "Todos los derechos reservados.",

        // Botón idioma
        lang_btn: "EN 🇺🇸"
    },
    en: {
        // Navbar
        nav_eventos: "Events",
        nav_turismo: "Tourism",
        nav_historia: "History",
        nav_contacto: "Contact",
        login: "Sign In",

        // Filtros de eventos (carrusel)
        cat_all: "All",
        cat_culture: "Culture",
        cat_gastro: "Gastronomy",
        cat_nature: "Nature",

        // Mapa
        map_title: "Explore the Map",
        filter_all: "All",
        filter_museums: "Museums & Culture",
        filter_cafes: "Coffee Shops",
        filter_restaurants: "Restaurants & Bars",
        filter_parks: "Parks & Nature",
        filter_emergency: "Emergency",

        // Sección Historia
        historia_title: "History & Culture of Saltillo",
        historia_p1: "Founded in 1577, Santiago de Saltillo is one of the oldest cities in northern Mexico. Its Historic Downtown houses architectural gems like the Catedral de Santiago, built in churrigueresque baroque style during the 18th century.",
        historia_p2: "Saltillo is known for its artisanal sarape tradition, its northern Mexican gastronomy, and its rich culture that blends indigenous Tlaxcaltecan influences with Spanish colonial heritage.",
        historia_p3: "Today, the city is an educational and cultural hub of northeastern Mexico, with world-class museums like the Museo del Desierto and Museo de las Aves de México, along with a vibrant scene of events and festivals throughout the year.",
        highlight_history: "of history",
        highlight_museums: "to explore",
        highlight_events: "per year",

        // Clima
        weather_title: "Current Weather in Saltillo",
        weather_loading: "Loading weather...",
        weather_feels: "Feels like",
        weather_wind: "Wind",
        weather_tip: "Recommendation",
        weather_forecast_title: "Next 3 days",
        weather_max: "Max",
        weather_min: "Min",

        // Carrusel - Botones
        btn_view_event: "View Event",

        // Favoritos panel
        fav_title: "My Favorites",
        fav_empty: "No favorites yet. Explore the map and save the places you like the most.",

        // Emergencias
        emergency_title: "🚨 Emergency Contacts — Saltillo",
        emergency_general: "General Emergencies",
        emergency_report: "Anonymous Report",
        emergency_redcross: "Red Cross Saltillo",
        emergency_fire: "Fire Department",

        // Footer
        footer_desc: "Your platform to discover events, tourism, and the culture of Saltillo, Coahuila.",
        footer_nav: "Navigation",
        footer_contact: "Contact",
        footer_follow: "Follow Us",
        footer_rights: "All rights reserved.",

        // Botón idioma
        lang_btn: "ES 🇲🇽"
    }
};

// ============================================
// MOTOR DE TRADUCCIÓN
// ============================================
let currentLang = localStorage.getItem('salturi_lang') || 'es';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('salturi_lang', lang);

    const dict = translations[lang];
    if (!dict) return;

    // Actualizar todos los elementos con data-i18n
    // SKIP: el botón .btn-login si el usuario está logueado (no tiene data-i18n cuando logueado)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });

    // Actualizar botón de idioma
    const btnLang = document.getElementById('btn-lang');
    if (btnLang) {
        btnLang.textContent = dict.lang_btn;
    }

    // Actualizar atributo lang del HTML
    document.documentElement.lang = lang === 'es' ? 'es' : 'en';

    // Re-renderizar componentes dinámicos si existen
    if (typeof renderCarousel === 'function') {
        renderCarousel();
    }
    if (typeof renderWeather === 'function' && window._weatherData) {
        renderWeather(window._weatherData);
    }

    // Re-aplicar estado de autenticación (restaurar nombre en navbar)
    if (typeof reapplyAuthState === 'function') {
        reapplyAuthState();
    }
}

function toggleLanguage() {
    const newLang = currentLang === 'es' ? 'en' : 'es';
    setLanguage(newLang);
}

function t(key) {
    const dict = translations[currentLang];
    return (dict && dict[key]) || key;
}

function initI18n() {
    const btnLang = document.getElementById('btn-lang');
    if (btnLang) {
        btnLang.addEventListener('click', toggleLanguage);
    }

    // Aplicar idioma guardado al cargar
    if (currentLang !== 'es') {
        setLanguage(currentLang);
    }
}

// ============================================
// INICIALIZAR
// ============================================
document.addEventListener('DOMContentLoaded', initI18n);

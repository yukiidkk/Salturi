/**
 * SALTURI — i18n.js
 * Sistema de traducción Español / Inglés
 */

const translations = {
    es: {
        // Navbar
        nav_eventos: "Eventos",
        nav_turismo: "Turismo",
        nav_historia: "Historia",
        nav_contacto: "Contacto",
        login: "Iniciar Sesión",

        // Filtros de eventos
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
        places_title: "Historia y Cultura de Saltillo",

        // Top Lugares
        top_places: "Top Lugares",

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

        // Filtros de eventos
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
        places_title: "History & Culture of Saltillo",

        // Top Lugares
        top_places: "Top Places",

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
}

function toggleLanguage() {
    const newLang = currentLang === 'es' ? 'en' : 'es';
    setLanguage(newLang);
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

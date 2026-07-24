/**
 * SALTURI — main.js
 * Lógica interactiva: Carrusel, Filtros, Navegación, Clima
 */

// ============================================
// DATOS MOCK DE EVENTOS
// ============================================
const eventosData = [
    {
        id: 1,
        title: "Concierto: Orquesta de Coahuila",
        date: "15 Agosto",
        date_en: "August 15",
        category: "cultura",
        image: "../images/evento-orquesta.jpg",
        location: "Teatro de la Ciudad",
        featured: false
    },
    {
        id: 2,
        title: "Feria de Saltillo: Tradición y Sabor",
        date: "25-31 Julio",
        date_en: "July 25-31",
        category: "gastronomia",
        image: "../images/evento-feria.jpg",
        location: "Centro de Convenciones",
        featured: true
    },
    {
        id: 3,
        title: "Mercado de Artesanos",
        date: "Cada Domingo",
        date_en: "Every Sunday",
        category: "cultura",
        image: "../images/evento-artesanos.jpg",
        location: "Plaza Nueva Tlaxcala",
        featured: false
    },
    {
        id: 4,
        title: "Ruta de Senderismo Sierra Zapalinamé",
        date: "10 Agosto",
        date_en: "August 10",
        category: "naturaleza",
        image: "../images/evento-senderismo.jpg",
        location: "Sierra Zapalinamé",
        featured: false
    },
    {
        id: 5,
        title: "Festival Gastronómico del Norte",
        date: "5-7 Septiembre",
        date_en: "September 5-7",
        category: "gastronomia",
        image: "../images/evento-gastronomico.jpg",
        location: "Parque Las Maravillas",
        featured: true
    },
    {
        id: 6,
        title: "Noche de Museos",
        date: "Último Viernes",
        date_en: "Last Friday",
        category: "cultura",
        image: "../images/evento-museos.jpg",
        location: "Centro Histórico",
        featured: false
    }
];

// ============================================
// CARRUSEL — Lógica de navegación
// ============================================
let currentIndex = 0;
let filteredEvents = [...eventosData];

function getVisibleGroup() {
    const total = filteredEvents.length;
    if (total === 0) return [];
    if (total === 1) return [null, filteredEvents[0], null];
    if (total === 2) return [filteredEvents[0], filteredEvents[1], null];

    const left = (currentIndex - 1 + total) % total;
    const center = currentIndex;
    const right = (currentIndex + 1) % total;
    return [filteredEvents[left], filteredEvents[center], filteredEvents[right]];
}

function renderCarousel() {
    const container = document.querySelector('.carousel-container');
    if (!container) return;

    const group = getVisibleGroup();
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'es';
    const btnText = (typeof t === 'function') ? t('btn_view_event') : 'Ver Evento';

    if (group.length === 0) {
        const noEventsMsg = lang === 'en' ? 'No events in this category.' : 'No hay eventos en esta categoría.';
        container.innerHTML = `<p style="color: var(--white); font-size: 1.1rem;">${noEventsMsg}</p>`;
        renderDots();
        return;
    }

    let html = '';

    // Tarjeta izquierda
    if (group[0]) {
        html += `
        <div class="card card-side">
            <div class="card-img-container">
                <img src="${group[0].image}" alt="${group[0].title}">
            </div>
            <h3>${group[0].title}</h3>
        </div>`;
    }

    // Tarjeta central (destacada)
    if (group[1]) {
        const dateText = lang === 'en' && group[1].date_en ? group[1].date_en : group[1].date;
        html += `
        <div class="card card-featured">
            <div class="card-img-container featured-img">
                <img src="${group[1].image}" alt="${group[1].title}">
            </div>
            <div class="card-content">
                <span class="date-tag">${dateText}</span>
                <h2>${group[1].title}</h2>
                <p class="card-location">📍 ${group[1].location}</p>
                <button type="button" class="btn-primary">${btnText}</button>
            </div>
        </div>`;
    }

    // Tarjeta derecha
    if (group[2]) {
        html += `
        <div class="card card-side">
            <div class="card-img-container">
                <img src="${group[2].image}" alt="${group[2].title}">
            </div>
            <h3>${group[2].title}</h3>
        </div>`;
    }

    container.innerHTML = html;
    renderDots();
}

function renderDots() {
    const dotsContainer = document.querySelector('.carousel-dots');
    if (!dotsContainer) return;

    const total = filteredEvents.length;
    let dotsHtml = '';
    for (let i = 0; i < total; i++) {
        dotsHtml += `<span class="dot ${i === currentIndex ? 'active' : ''}" data-index="${i}"></span>`;
    }
    dotsContainer.innerHTML = dotsHtml;

    dotsContainer.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', () => {
            currentIndex = parseInt(dot.dataset.index);
            renderCarousel();
        });
    });
}

function nextSlide() {
    if (filteredEvents.length === 0) return;
    currentIndex = (currentIndex + 1) % filteredEvents.length;
    renderCarousel();
}

function prevSlide() {
    if (filteredEvents.length === 0) return;
    currentIndex = (currentIndex - 1 + filteredEvents.length) % filteredEvents.length;
    renderCarousel();
}

function initCarouselArrows() {
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    if (leftArrow) leftArrow.addEventListener('click', prevSlide);
    if (rightArrow) rightArrow.addEventListener('click', nextSlide);
}

// ============================================
// FILTROS POR CATEGORÍA
// ============================================
function filterByCategory(category) {
    currentIndex = 0;
    if (category === 'todos') {
        filteredEvents = [...eventosData];
    } else {
        filteredEvents = eventosData.filter(e => e.category === category);
    }
    renderCarousel();
    updateActiveFilter(category);
}

function updateActiveFilter(activeCategory) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('filter-active', btn.dataset.category === activeCategory);
    });
}

function initFilters() {
    const filtersContainer = document.querySelector('.filters-container');
    if (!filtersContainer) return;
    filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterByCategory(btn.dataset.category);
        });
    });
}

// ============================================
// NAVEGACIÓN — Active state en scroll
// ============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    const sections = document.querySelectorAll('section[id], footer[id]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(section => observer.observe(section));
}

// ============================================
// TECLADO — Navegación con flechas
// ============================================
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

// ============================================
// CLIMA EN TIEMPO REAL — Open-Meteo API
// ============================================
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=25.4260&longitude=-101.0000&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=America%2FMexico_City&forecast_days=4';

// Mapeo de weathercode a ícono FontAwesome y descripción
const weatherCodes = {
    0: { icon: 'fa-sun', es: 'Despejado', en: 'Clear sky' },
    1: { icon: 'fa-sun', es: 'Mayormente despejado', en: 'Mostly clear' },
    2: { icon: 'fa-cloud-sun', es: 'Parcialmente nublado', en: 'Partly cloudy' },
    3: { icon: 'fa-cloud', es: 'Nublado', en: 'Overcast' },
    45: { icon: 'fa-smog', es: 'Neblina', en: 'Foggy' },
    48: { icon: 'fa-smog', es: 'Neblina helada', en: 'Rime fog' },
    51: { icon: 'fa-cloud-rain', es: 'Llovizna ligera', en: 'Light drizzle' },
    53: { icon: 'fa-cloud-rain', es: 'Llovizna moderada', en: 'Moderate drizzle' },
    55: { icon: 'fa-cloud-rain', es: 'Llovizna densa', en: 'Dense drizzle' },
    61: { icon: 'fa-cloud-showers-heavy', es: 'Lluvia ligera', en: 'Light rain' },
    63: { icon: 'fa-cloud-showers-heavy', es: 'Lluvia moderada', en: 'Moderate rain' },
    65: { icon: 'fa-cloud-showers-heavy', es: 'Lluvia intensa', en: 'Heavy rain' },
    71: { icon: 'fa-snowflake', es: 'Nevada ligera', en: 'Light snow' },
    73: { icon: 'fa-snowflake', es: 'Nevada moderada', en: 'Moderate snow' },
    75: { icon: 'fa-snowflake', es: 'Nevada intensa', en: 'Heavy snow' },
    80: { icon: 'fa-cloud-showers-heavy', es: 'Chubascos ligeros', en: 'Light showers' },
    81: { icon: 'fa-cloud-showers-heavy', es: 'Chubascos moderados', en: 'Moderate showers' },
    82: { icon: 'fa-cloud-showers-heavy', es: 'Chubascos violentos', en: 'Violent showers' },
    95: { icon: 'fa-bolt', es: 'Tormenta eléctrica', en: 'Thunderstorm' },
    96: { icon: 'fa-bolt', es: 'Tormenta con granizo', en: 'Thunderstorm with hail' },
    99: { icon: 'fa-bolt', es: 'Tormenta severa', en: 'Severe thunderstorm' }
};

function getWeatherInfo(code) {
    return weatherCodes[code] || { icon: 'fa-cloud', es: 'Variable', en: 'Variable' };
}

function getWeatherRecommendation(code, temp) {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'es';

    if (temp >= 35) {
        return lang === 'en'
            ? 'Very hot day. Stay hydrated and visit air-conditioned museums like Museo del Desierto.'
            : 'Día muy caluroso. Mantente hidratado y visita museos con clima como el Museo del Desierto.';
    }
    if (temp >= 28) {
        return lang === 'en'
            ? 'Warm day, perfect for an iced coffee at Paseo Capital or a stroll through Alameda Zaragoza.'
            : 'Día cálido, perfecto para un café helado en Paseo Capital o pasear por la Alameda Zaragoza.';
    }
    if (code >= 61 && code <= 82) {
        return lang === 'en'
            ? 'Rainy day. Ideal for visiting museums or having coffee at Índigo Café Galería.'
            : 'Día lluvioso. Ideal para visitar museos o tomar un café en Índigo Café Galería.';
    }
    if (code >= 95) {
        return lang === 'en'
            ? 'Storm expected. Stay indoors and enjoy indoor activities or a restaurant in Centro Histórico.'
            : 'Se esperan tormentas. Quédate en interiores y disfruta un restaurante en Centro Histórico.';
    }
    if (temp <= 10) {
        return lang === 'en'
            ? 'Cold day. Bundle up and warm up with a hot chocolate at Flor y Canela.'
            : 'Día frío. Abrígate y caliéntate con un chocolate caliente en Flor y Canela.';
    }
    if (temp <= 18) {
        return lang === 'en'
            ? 'Cool weather. Great for walking the Centro Histórico or hiking Sierra Zapalinamé.'
            : 'Clima fresco. Excelente para caminar el Centro Histórico o hacer senderismo en Sierra Zapalinamé.';
    }
    // Default: pleasant weather
    return lang === 'en'
        ? 'Perfect day to explore Saltillo! Visit the map and discover new places.'
        : 'Día perfecto para explorar Saltillo. Revisa el mapa y descubre nuevos lugares.';
}

function renderWeather(data) {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'es';
    const currentContainer = document.getElementById('weather-current');
    const forecastContainer = document.getElementById('weather-forecast');

    if (!currentContainer || !data) return;

    const current = data.current_weather;
    const daily = data.daily;
    const weatherInfo = getWeatherInfo(current.weathercode);
    const description = lang === 'en' ? weatherInfo.en : weatherInfo.es;
    const recommendation = getWeatherRecommendation(current.weathercode, current.temperature);

    const feelsLabel = (typeof t === 'function') ? t('weather_feels') : 'Sensación térmica';
    const windLabel = (typeof t === 'function') ? t('weather_wind') : 'Viento';
    const tipLabel = (typeof t === 'function') ? t('weather_tip') : 'Recomendación';
    const forecastTitle = (typeof t === 'function') ? t('weather_forecast_title') : 'Próximos 3 días';
    const maxLabel = (typeof t === 'function') ? t('weather_max') : 'Máx';
    const minLabel = (typeof t === 'function') ? t('weather_min') : 'Mín';

    // Sensación térmica aproximada (wind chill simplificado)
    const feelsLike = Math.round(current.temperature - (current.windspeed * 0.1));

    currentContainer.innerHTML = `
        <div class="weather-main">
            <i class="fa-solid ${weatherInfo.icon} weather-icon"></i>
            <div class="weather-temp">
                <span class="temp-value">${Math.round(current.temperature)}°C</span>
                <span class="temp-desc">${description}</span>
            </div>
        </div>
        <div class="weather-details">
            <p><i class="fa-solid fa-temperature-half"></i> ${feelsLabel}: <strong>${feelsLike}°C</strong></p>
            <p><i class="fa-solid fa-wind"></i> ${windLabel}: <strong>${current.windspeed} km/h</strong></p>
        </div>
        <div class="weather-recommendation">
            <p><i class="fa-solid fa-lightbulb"></i> <strong>${tipLabel}:</strong> ${recommendation}</p>
        </div>
    `;

    // Pronóstico 3 días (empezando desde mañana)
    if (forecastContainer && daily) {
        let forecastHtml = `<h3>${forecastTitle}</h3><div class="forecast-cards">`;

        const dayNames = lang === 'en'
            ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            : ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

        for (let i = 1; i <= 3; i++) {
            if (!daily.time[i]) continue;
            const dayDate = new Date(daily.time[i] + 'T12:00:00');
            const dayName = dayNames[dayDate.getDay()];
            const dayWeather = getWeatherInfo(daily.weathercode[i]);
            const maxTemp = Math.round(daily.temperature_2m_max[i]);
            const minTemp = Math.round(daily.temperature_2m_min[i]);

            forecastHtml += `
                <div class="forecast-card">
                    <span class="forecast-day">${dayName}</span>
                    <i class="fa-solid ${dayWeather.icon}"></i>
                    <span class="forecast-temps">${maxLabel} ${maxTemp}° / ${minLabel} ${minTemp}°</span>
                </div>
            `;
        }

        forecastHtml += '</div>';
        forecastContainer.innerHTML = forecastHtml;
    }
}

async function fetchWeather() {
    try {
        const response = await fetch(WEATHER_API_URL);
        if (!response.ok) throw new Error('Weather API error');
        const data = await response.json();
        window._weatherData = data;
        renderWeather(data);
    } catch (error) {
        console.warn('Error fetching weather:', error);
        const container = document.getElementById('weather-current');
        if (container) {
            const lang = (typeof currentLang !== 'undefined') ? currentLang : 'es';
            const msg = lang === 'en' ? 'Unable to load weather data.' : 'No se pudo cargar el clima.';
            container.innerHTML = `<p class="weather-error"><i class="fa-solid fa-triangle-exclamation"></i> ${msg}</p>`;
        }
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    renderCarousel();
    initCarouselArrows();
    initFilters();
    initNavigation();
    initKeyboardNav();
    fetchWeather();
});

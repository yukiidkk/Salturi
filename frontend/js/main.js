/**
 * SALTURI — main.js
 * Lógica interactiva: Carrusel, Filtros por Categoría, Navegación
 */

// ============================================
// DATOS MOCK DE EVENTOS (Fase 2.3)
// ============================================
const eventosData = [
    {
        id: 1,
        title: "Concierto: Orquesta de Coahuila",
        date: "15 Agosto",
        category: "cultura",
        image: "../images/evento-orquesta.jpg",
        location: "Teatro de la Ciudad",
        featured: false
    },
    {
        id: 2,
        title: "Feria de Saltillo: Tradición y Sabor",
        date: "25-31 Julio",
        category: "gastronomia",
        image: "../images/evento-feria.jpg",
        location: "Centro de Convenciones",
        featured: true
    },
    {
        id: 3,
        title: "Mercado de Artesanos",
        date: "Cada Domingo",
        category: "cultura",
        image: "../images/evento-artesanos.jpg",
        location: "Plaza Nueva Tlaxcala",
        featured: false
    },
    {
        id: 4,
        title: "Ruta de Senderismo Sierra Zapalinamé",
        date: "10 Agosto",
        category: "naturaleza",
        image: "../images/evento-senderismo.jpg",
        location: "Sierra Zapalinamé",
        featured: false
    },
    {
        id: 5,
        title: "Festival Gastronómico del Norte",
        date: "5-7 Septiembre",
        category: "gastronomia",
        image: "../images/evento-gastronomico.jpg",
        location: "Parque Las Maravillas",
        featured: true
    },
    {
        id: 6,
        title: "Noche de Museos",
        date: "Último Viernes",
        category: "cultura",
        image: "../images/evento-museos.jpg",
        location: "Centro Histórico",
        featured: false
    }
];

// ============================================
// CARRUSEL — Lógica de navegación (Fase 2.1 & 2.2)
// ============================================
let currentIndex = 0;
let filteredEvents = [...eventosData];

function getVisibleGroup() {
    // Devuelve grupo de 3: [izquierda, centro, derecha]
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

    if (group.length === 0) {
        container.innerHTML = '<p style="color: var(--white); font-size: 1.1rem;">No hay eventos en esta categoría.</p>';
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
        html += `
        <div class="card card-featured">
            <div class="card-img-container featured-img">
                <img src="${group[1].image}" alt="${group[1].title}">
            </div>
            <div class="card-content">
                <span class="date-tag">${group[1].date}</span>
                <h2>${group[1].title}</h2>
                <p class="card-location">📍 ${group[1].location}</p>
                <button type="button" class="btn-primary">Ver Evento</button>
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

    // Click en dots para navegar
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

// Event listeners para flechas
function initCarouselArrows() {
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    if (leftArrow) leftArrow.addEventListener('click', prevSlide);
    if (rightArrow) rightArrow.addEventListener('click', nextSlide);
}

// ============================================
// FILTROS POR CATEGORÍA (Fase 2.2)
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
// NAVEGACIÓN — Active state en scroll (Fase 2.1)
// ============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const btnLogin = document.querySelector('.btn-login');

    // Actualizar clase "active" al hacer clic
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Actualizar clase "active" al hacer scroll (Intersection Observer)
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
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    renderCarousel();
    initCarouselArrows();
    initFilters();
    initNavigation();
    initKeyboardNav();
});

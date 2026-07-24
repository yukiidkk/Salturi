/**
 * SALTURI — map.js
 * Mapa interactivo con Leaflet.js — Base de datos ampliada Norte/Centro/Sur de Saltillo
 */

// ============================================
// CONFIGURACIÓN DE CATEGORÍAS
// ============================================
const CATEGORIAS = {
    museo: {
        label: 'Museos y Cultura',
        color: '#F18D4E',
        icon: 'fa-landmark'
    },
    cafeteria: {
        label: 'Cafeterías',
        color: '#8B5E3C',
        icon: 'fa-mug-hot'
    },
    restaurante: {
        label: 'Restaurantes y Bares',
        color: '#5FA7A4',
        icon: 'fa-utensils'
    },
    naturaleza: {
        label: 'Parques y Naturaleza',
        color: '#2E7D32',
        icon: 'fa-tree'
    },
    emergencia: {
        label: 'Emergencias',
        color: '#D9534F',
        icon: 'fa-hospital'
    }
};

// ============================================
// BASE DE DATOS DE LUGARES — Norte / Centro / Sur
// ============================================
const lugaresData = [
    // ─── MUSEOS Y CULTURA ───────────────────────────────
    {
        id: 1,
        name: "Museo del Desierto",
        category: "museo",
        zone: "norte",
        lat: 25.4385,
        lng: -100.9780,
        description: "Uno de los mejores museos de historia natural de Latinoamérica. Paleontología, ecosistemas del desierto y jardín botánico.",
        googleMapsUrl: "https://maps.google.com/?q=Museo+del+Desierto+Saltillo"
    },
    {
        id: 2,
        name: "Museo de las Aves de México",
        category: "museo",
        zone: "centro",
        lat: 25.4215,
        lng: -100.9978,
        description: "Más de 3,000 ejemplares de aves mexicanas. Experiencia interactiva y educativa para toda la familia.",
        googleMapsUrl: "https://maps.google.com/?q=Museo+de+las+Aves+Saltillo"
    },
    {
        id: 3,
        name: "Museo del Sarape y Trajes Mexicanos",
        category: "museo",
        zone: "centro",
        lat: 25.4233,
        lng: -101.0008,
        description: "Exhibición de la tradición textil de Saltillo y vestimenta tradicional mexicana a lo largo de la historia.",
        googleMapsUrl: "https://maps.google.com/?q=Museo+del+Sarape+Saltillo"
    },
    {
        id: 4,
        name: "Museo de la Katrina",
        category: "museo",
        zone: "centro",
        lat: 25.4190,
        lng: -101.0005,
        description: "Espacio dedicado al arte y la cultura del Día de Muertos con figuras de Katrina en tamaño real.",
        googleMapsUrl: "https://maps.google.com/?q=Museo+de+la+Katrina+Saltillo"
    },
    {
        id: 5,
        name: "Centro Cultural Vito Alessio Robles",
        category: "museo",
        zone: "centro",
        lat: 25.4245,
        lng: -101.0012,
        description: "Centro cultural con exposiciones temporales, talleres artísticos y eventos culturales en el corazón de Saltillo.",
        googleMapsUrl: "https://maps.google.com/?q=Centro+Cultural+Vito+Alessio+Robles+Saltillo"
    },
    {
        id: 6,
        name: "Museo Normalista",
        category: "museo",
        zone: "sur",
        lat: 25.4095,
        lng: -101.0010,
        description: "Museo histórico que narra la evolución de la educación normalista en Coahuila.",
        googleMapsUrl: "https://maps.google.com/?q=Museo+Normalista+Saltillo"
    },

    // ─── CAFETERÍAS ─────────────────────────────────────
    {
        id: 7,
        name: "Zoco Brema Café",
        category: "cafeteria",
        zone: "norte",
        lat: 25.4520,
        lng: -100.9885,
        description: "Café de especialidad con ambiente acogedor en la zona de Venustiano Carranza. Pastelería artesanal.",
        googleMapsUrl: "https://maps.google.com/?q=Zoco+Brema+Cafe+Saltillo"
    },
    {
        id: 8,
        name: "Brazza / Coffree",
        category: "cafeteria",
        zone: "norte",
        lat: 25.4650,
        lng: -100.9810,
        description: "Cafetería moderna en Pedro Figueroa con granos de origen y métodos alternativos de preparación.",
        googleMapsUrl: "https://maps.google.com/?q=Brazza+Coffree+Saltillo"
    },
    {
        id: 9,
        name: "Café Floral / Amikuu",
        category: "cafeteria",
        zone: "norte",
        lat: 25.4580,
        lng: -100.9690,
        description: "Café con concepto floral en Eulalio Gutiérrez. Ideal para trabajo remoto y brunch.",
        googleMapsUrl: "https://maps.google.com/?q=Amikuu+Cafe+Saltillo"
    },
    {
        id: 10,
        name: "Kala Caffe / Paseo Capital",
        category: "cafeteria",
        zone: "centro",
        lat: 25.4235,
        lng: -101.0000,
        description: "Café de especialidad en el centro de Saltillo. Ambiente minimalista y repostería fina.",
        googleMapsUrl: "https://maps.google.com/?q=Kala+Caffe+Saltillo"
    },
    {
        id: 11,
        name: "Índigo Café Galería",
        category: "cafeteria",
        zone: "centro",
        lat: 25.4210,
        lng: -101.0020,
        description: "Cafetería-galería con exposiciones de artistas locales. Café de Chiapas y Oaxaca.",
        googleMapsUrl: "https://maps.google.com/?q=Indigo+Cafe+Galeria+Saltillo"
    },
    {
        id: 12,
        name: "Flor y Canela",
        category: "cafeteria",
        zone: "centro",
        lat: 25.4242,
        lng: -100.9985,
        description: "Café tradicional con panadería mexicana artesanal. Ambiente cálido y familiar.",
        googleMapsUrl: "https://maps.google.com/?q=Flor+y+Canela+Saltillo"
    },
    {
        id: 13,
        name: "Café El Sótano",
        category: "cafeteria",
        zone: "sur",
        lat: 25.4120,
        lng: -100.9850,
        description: "Cafetería alternativa en Otilio González con música en vivo los fines de semana.",
        googleMapsUrl: "https://maps.google.com/?q=Cafe+El+Sotano+Saltillo"
    },

    // ─── RESTAURANTES Y BARES ───────────────────────────
    {
        id: 14,
        name: "El Mesón Principal",
        category: "restaurante",
        zone: "norte",
        lat: 25.4480,
        lng: -100.9890,
        description: "Cocina regional del noreste. Cortes de carne, cabrito y platillos tradicionales de Coahuila.",
        googleMapsUrl: "https://maps.google.com/?q=El+Meson+Principal+Saltillo"
    },
    {
        id: 15,
        name: "Il Mercato Gentiloni",
        category: "restaurante",
        zone: "norte",
        lat: 25.4565,
        lng: -100.9875,
        description: "Cocina italiana gourmet cerca del Parque Centro. Pastas artesanales y vinos selectos.",
        googleMapsUrl: "https://maps.google.com/?q=Il+Mercato+Gentiloni+Saltillo"
    },
    {
        id: 16,
        name: "Mochomos / Ryoshi",
        category: "restaurante",
        zone: "norte",
        lat: 25.4625,
        lng: -100.9840,
        description: "Restaurantes en Paseo Villalta. Mochomos (sinaloense) y Ryoshi (japonés) en la misma zona.",
        googleMapsUrl: "https://maps.google.com/?q=Mochomos+Saltillo"
    },
    {
        id: 17,
        name: "Pour Le France!",
        category: "restaurante",
        zone: "norte",
        lat: 25.4420,
        lng: -100.9915,
        description: "Bistró francés en la zona de Carranza. Crepes, quiches y pastelería francesa auténtica.",
        googleMapsUrl: "https://maps.google.com/?q=Pour+Le+France+Saltillo"
    },
    {
        id: 18,
        name: "Don Artemio",
        category: "restaurante",
        zone: "norte",
        lat: 25.4510,
        lng: -100.9870,
        description: "Restaurante de alta cocina norteña. Experiencia gastronómica con ingredientes del desierto.",
        googleMapsUrl: "https://maps.google.com/?q=Don+Artemio+Saltillo"
    },
    {
        id: 19,
        name: "Sol y Luna Restaurante",
        category: "restaurante",
        zone: "centro",
        lat: 25.4220,
        lng: -101.0015,
        description: "Cocina mexicana contemporánea en el centro histórico. Terraza con vista a la catedral.",
        googleMapsUrl: "https://maps.google.com/?q=Sol+y+Luna+Restaurante+Saltillo"
    },
    {
        id: 20,
        name: "Las Brasas",
        category: "restaurante",
        zone: "sur",
        lat: 25.3980,
        lng: -101.0030,
        description: "Parrilla y carnes al carbón en el Periférico Echeverría. Ambiente familiar con jardín.",
        googleMapsUrl: "https://maps.google.com/?q=Las+Brasas+Saltillo"
    },
    {
        id: 21,
        name: "Taquería El Pastor",
        category: "restaurante",
        zone: "sur",
        lat: 25.3910,
        lng: -101.0120,
        description: "Tacos al pastor y grill norteño en Antonio Cárdenas. Abierto hasta tarde.",
        googleMapsUrl: "https://maps.google.com/?q=Taqueria+El+Pastor+Saltillo"
    },

    // ─── PARQUES Y NATURALEZA ───────────────────────────
    {
        id: 22,
        name: "Parque Centro",
        category: "naturaleza",
        zone: "norte",
        lat: 25.4560,
        lng: -100.9880,
        description: "Parque urbano con lago, áreas de ejercicio, zona infantil y pista para correr.",
        googleMapsUrl: "https://maps.google.com/?q=Parque+Centro+Saltillo"
    },
    {
        id: 23,
        name: "Biblioparque Norte",
        category: "naturaleza",
        zone: "norte",
        lat: 25.4710,
        lng: -100.9720,
        description: "Espacio verde con biblioteca pública, andadores y áreas de lectura al aire libre.",
        googleMapsUrl: "https://maps.google.com/?q=Biblioparque+Norte+Saltillo"
    },
    {
        id: 24,
        name: "Parque Las Maravillas",
        category: "naturaleza",
        zone: "norte",
        lat: 25.4370,
        lng: -100.9790,
        description: "Gran parque con lago artificial, senderos naturales, áreas deportivas y zona de picnic.",
        googleMapsUrl: "https://maps.google.com/?q=Parque+Las+Maravillas+Saltillo"
    },
    {
        id: 25,
        name: "Alameda Zaragoza",
        category: "naturaleza",
        zone: "centro",
        lat: 25.4262,
        lng: -101.0048,
        description: "Icónica alameda del centro de Saltillo. Fuentes, jardines y kiosco histórico.",
        googleMapsUrl: "https://maps.google.com/?q=Alameda+Zaragoza+Saltillo"
    },
    {
        id: 26,
        name: "Parque Mirador Saltillo",
        category: "naturaleza",
        zone: "centro",
        lat: 25.4180,
        lng: -101.0020,
        description: "Mirador con vista panorámica de la ciudad. Ideal para atardeceres y fotografía.",
        googleMapsUrl: "https://maps.google.com/?q=Parque+Mirador+Saltillo"
    },
    {
        id: 27,
        name: "Biblioparque Sur",
        category: "naturaleza",
        zone: "sur",
        lat: 25.3850,
        lng: -101.0150,
        description: "Biblioteca pública con áreas verdes, zona de lectura infantil y talleres comunitarios.",
        googleMapsUrl: "https://maps.google.com/?q=Biblioparque+Sur+Saltillo"
    },
    {
        id: 28,
        name: "Cañón de San Lorenzo / Zapalinamé",
        category: "naturaleza",
        zone: "sur",
        lat: 25.3520,
        lng: -100.9750,
        description: "Entrada a la Sierra de Zapalinamé. Rutas de senderismo, biodiversidad y paisajes de montaña.",
        googleMapsUrl: "https://maps.google.com/?q=Canon+de+San+Lorenzo+Saltillo"
    },

    // ─── EMERGENCIAS ────────────────────────────────────
    {
        id: 29,
        name: "Hospital General Saltillo",
        category: "emergencia",
        zone: "sur",
        lat: 25.4050,
        lng: -100.9950,
        description: "Hospital público de segundo nivel. Urgencias 24 horas, consulta externa y especialidades médicas.",
        googleMapsUrl: "https://maps.google.com/?q=Hospital+General+Saltillo"
    },
    {
        id: 30,
        name: "Hospital de Especialidades IMSS 2",
        category: "emergencia",
        zone: "centro",
        lat: 25.4310,
        lng: -100.9920,
        description: "Hospital de alta especialidad del IMSS. Atención de urgencias, cirugía y medicina interna.",
        googleMapsUrl: "https://maps.google.com/?q=IMSS+Especialidades+Saltillo"
    },
    {
        id: 31,
        name: "Cruz Roja Mexicana — Delegación Saltillo",
        category: "emergencia",
        zone: "centro",
        lat: 25.4280,
        lng: -101.0080,
        description: "Ambulancias, atención prehospitalaria y primeros auxilios. Línea directa: 844 412 1206.",
        googleMapsUrl: "https://maps.google.com/?q=Cruz+Roja+Saltillo"
    },
    {
        id: 32,
        name: "Estación Central de Bomberos",
        category: "emergencia",
        zone: "centro",
        lat: 25.4220,
        lng: -101.0090,
        description: "Cuerpo de bomberos de Saltillo. Respuesta a incendios, rescates y materiales peligrosos. Tel: 844 415 4222.",
        googleMapsUrl: "https://maps.google.com/?q=Bomberos+Saltillo"
    },
    {
        id: 33,
        name: "Comisaría de Seguridad y Protección Ciudadana",
        category: "emergencia",
        zone: "norte",
        lat: 25.4410,
        lng: -100.9850,
        description: "Sede de la policía municipal. Reportes de seguridad y coordinación de patrullas. Línea: 911.",
        googleMapsUrl: "https://maps.google.com/?q=Comisaria+Seguridad+Saltillo"
    }
];

// ============================================
// ÍCONOS PERSONALIZADOS CON FONTAWESOME
// ============================================
function createCategoryIcon(category) {
    const config = CATEGORIAS[category] || { color: '#5FA7A4', icon: 'fa-map-pin' };

    return L.divIcon({
        className: 'custom-map-marker',
        html: `
            <div class="marker-pin" style="background-color: ${config.color};">
                <i class="fa-solid ${config.icon}"></i>
            </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 44],
        popupAnchor: [0, -40]
    });
}

// ============================================
// MAPA — INICIALIZACIÓN
// ============================================
let map;
let allMarkers = [];
let activeFilter = 'todos';

function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Centro entre Norte y Sur de Saltillo, zoom 12 para abarcar toda la ciudad
    map = L.map('map', {
        center: [25.4200, -100.9950],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true
    });

    // Tiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(map);

    // Agregar todos los marcadores
    addAllMarkers();

    // Inicializar filtros
    initMapFilters();

    // Recalcular tamaño del mapa
    setTimeout(() => map.invalidateSize(), 300);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) map.invalidateSize();
        });
    });
    observer.observe(mapContainer);
}

// ============================================
// MARCADORES
// ============================================
function addAllMarkers() {
    lugaresData.forEach(lugar => {
        const marker = L.marker([lugar.lat, lugar.lng], {
            icon: createCategoryIcon(lugar.category)
        });

        const catConfig = CATEGORIAS[lugar.category];
        const popupContent = `
            <div class="map-popup">
                <div class="popup-header" style="border-left: 4px solid ${catConfig.color}; padding-left: 0.6rem;">
                    <h3>${lugar.name}</h3>
                    <span class="popup-zone">${lugar.zone.charAt(0).toUpperCase() + lugar.zone.slice(1)} · ${catConfig.label}</span>
                </div>
                <p>${lugar.description}</p>
                <div class="popup-actions">
                    <a href="${lugar.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="popup-btn">
                        📍 ¿Cómo llegar?
                    </a>
                    <button type="button" class="popup-btn popup-fav" onclick="toggleFavorite(${lugar.id}, '${lugar.name.replace(/'/g, "\\'")}')">
                        ❤️ Favorito
                    </button>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'salturi-popup'
        });

        marker.addTo(map);
        allMarkers.push({ marker, category: lugar.category });
    });
}

// ============================================
// FILTROS DEL MAPA
// ============================================
function initMapFilters() {
    const filterBtns = document.querySelectorAll('.map-filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            activeFilter = filter;

            // Actualizar UI de botones
            filterBtns.forEach(b => b.classList.remove('map-filter-active'));
            btn.classList.add('map-filter-active');

            // Mostrar/ocultar marcadores
            applyFilter(filter);
        });
    });
}

function applyFilter(filter) {
    allMarkers.forEach(({ marker, category }) => {
        if (filter === 'todos' || category === filter) {
            if (!map.hasLayer(marker)) {
                marker.addTo(map);
            }
        } else {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        }
    });

    // Ajustar vista a los marcadores visibles
    const visibleMarkers = allMarkers
        .filter(({ category }) => filter === 'todos' || category === filter)
        .map(({ marker }) => marker.getLatLng());

    if (visibleMarkers.length > 0) {
        const bounds = L.latLngBounds(visibleMarkers);
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
    }
}

// ============================================
// FAVORITOS (localStorage)
// ============================================
function toggleFavorite(id, name) {
    let favorites = JSON.parse(localStorage.getItem('salturi_favorites') || '[]');

    const index = favorites.findIndex(f => f.id === id);
    if (index > -1) {
        favorites.splice(index, 1);
        showToast(`${name} eliminado de favoritos`);
    } else {
        favorites.push({ id, name, addedAt: new Date().toISOString() });
        showToast(`${name} guardado en favoritos ❤️`);
    }

    localStorage.setItem('salturi_favorites', JSON.stringify(favorites));
}

function showToast(message) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('toast-visible'), 10);
    setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ============================================
// INICIALIZAR
// ============================================
document.addEventListener('DOMContentLoaded', initMap);

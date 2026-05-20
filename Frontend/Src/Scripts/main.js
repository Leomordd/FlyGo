/* ============================================
   JAVASCRIPT PRINCIPAL - FLYGO
   ============================================ */

// ========== VARIABLES GLOBALES ==========
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const searchInput = document.querySelector('.search-input');

// ========== NAVEGACIÓN MÓVIL ==========

/**
 * Toggle del menú móvil
 */
function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

/**
 * Cerrar menú móvil al hacer click en un enlace
 */
function closeMobileMenu() {
    if (window.innerWidth <= 640) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Event listeners para navegación móvil
if (navToggle) {
    navToggle.addEventListener('click', toggleMobileMenu);
}

navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Cerrar menú al hacer click fuera
document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    }
});

// ========== NAVEGACIÓN ACTIVA ==========

/**
 * Actualizar enlace activo según la sección visible
 */
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

// ========== SCROLL SUAVE ==========

/**
 * Scroll suave para enlaces internos
 */
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ========== NAVBAR SCROLL EFFECT ==========

/**
 * Agregar sombra al navbar al hacer scroll
 */
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.boxShadow = 'var(--shadow-lg)';
        navbar.style.backgroundColor = 'var(--bg-overlay)';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.backgroundColor = 'var(--bg-secondary)';
    }
}

// ========== SCROLL REVEAL ANIMATIONS ==========

/**
 * Revelar elementos al hacer scroll
 */
function revealOnScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('revealed');
        }
    });
}

// ========== BÚSQUEDA ==========

/**
 * Manejar búsqueda (placeholder - implementar según necesidades)
 */
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                console.log('Buscando:', searchTerm);
                // Aquí implementar la lógica de búsqueda
                // Por ejemplo: redirigir a página de resultados
                // window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
            }
        }
    });
    
    // Botón de búsqueda
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                console.log('Buscando:', searchTerm);
                // Implementar lógica de búsqueda
            }
        });
    }
}

// ========== ANIMACIÓN DE TARJETAS ==========

/**
 * Agregar interactividad a las tarjetas de destinos
 */
function initDestinationCards() {
    const cards = document.querySelectorAll('.destination-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Click en tarjeta (placeholder)
        card.addEventListener('click', function() {
            const destination = this.querySelector('h3').textContent;
            console.log('Destino seleccionado:', destination);
            // Aquí implementar navegación o modal con más información
        });
    });
}

// ========== BOTONES CTA ==========

/**
 * Manejar clicks en botones de llamada a la acción
 */
function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('.hero-cta .btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            console.log('CTA clicked:', buttonText);
            
            // Implementar acciones según el botón
            if (buttonText.includes('Explorar')) {
                // Scroll a sección de destinos
                const destinationsSection = document.getElementById('destinos');
                if (destinationsSection) {
                    destinationsSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (buttonText.includes('Ofertas')) {
                // Navegar a ofertas o mostrar modal
                console.log('Mostrando ofertas...');
            }
        });
    });
}

// ========== LAZY LOADING DE IMÁGENES ==========

/**
 * Lazy loading para imágenes (si se agregan en el futuro)
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========== THEME TOGGLE (Opcional) ==========

/**
 * Toggle entre tema claro y oscuro
 */
function initThemeToggle() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Si agregas un botón de toggle de tema:
    // const themeToggle = document.querySelector('.theme-toggle');
    // if (themeToggle) {
    //     themeToggle.addEventListener('click', () => {
    //         const currentTheme = document.documentElement.getAttribute('data-theme');
    //         const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    //         document.documentElement.setAttribute('data-theme', newTheme);
    //         localStorage.setItem('theme', newTheme);
    //     });
    // }
}

// ========== UTILIDADES ==========

/**
 * Debounce function para optimizar eventos
 */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Throttle function para optimizar eventos
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========== EVENT LISTENERS ==========

// Scroll events (optimizados)
window.addEventListener('scroll', debounce(() => {
    updateActiveLink();
    handleNavbarScroll();
    revealOnScroll();
}));

// Resize events
window.addEventListener('resize', debounce(() => {
    // Cerrar menú móvil si se cambia a desktop
    if (window.innerWidth > 640 && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
}));

// ========== INICIALIZACIÓN ==========

/**
 * Inicializar todas las funcionalidades cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 FlyGo inicializado correctamente');
    
    // Inicializar componentes
    initDestinationCards();
    initCTAButtons();
    initLazyLoading();
    initThemeToggle();
    
    // Ejecutar funciones iniciales
    updateActiveLink();
    handleNavbarScroll();
    revealOnScroll();
    
    // Agregar clase para animaciones de entrada
    document.body.classList.add('loaded');
});

// ========== MANEJO DE ERRORES ==========

/**
 * Manejo global de errores
 */
window.addEventListener('error', (e) => {
    console.error('Error detectado:', e.error);
    // Aquí podrías enviar errores a un servicio de logging
});

// ========== EXPORTAR FUNCIONES (si usas módulos) ==========

// Si usas ES6 modules, puedes exportar funciones:
// export { toggleMobileMenu, updateActiveLink, debounce, throttle };

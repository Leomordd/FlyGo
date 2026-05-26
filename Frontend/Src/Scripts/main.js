/* ============================================
   JAVASCRIPT PRINCIPAL - FLYGO
   ============================================ */

// ========== VARIABLES GLOBALES ==========
const botonHamburguesa = document.querySelector('.boton-hamburguesa');
const menuNavegacion = document.querySelector('.menu-navegacion');
const enlacesNavegacion = document.querySelectorAll('.enlace-navegacion');
const entradaBusqueda = document.querySelector('.entrada-busqueda');
// Variables para usuario
const botonCarrito = document.querySelector('.boton-carrito');
const notificacionCarrito = document.querySelector('.notificacion-carrito');
const botonesIniciarSesion = document.querySelectorAll('.boton-iniciar-sesion');
const botonesRegistrarse = document.querySelectorAll('.boton-registrarse');
let navegacionManualActiva = false;
let temporizadorNavegacionManual;

// ========== CARRITO DE COMPRAS ==========

/**
 * Obtener cantidad de artículos en el carrito
 */
function obtenerCantidadCarrito() {
    return localStorage.getItem('cantidadCarrito') || '0';
}

/**
 * Actualizar notificación del carrito
 */
function actualizarNotificacionCarrito() {
    const cantidad = obtenerCantidadCarrito();
    if (notificacionCarrito) {
        notificacionCarrito.textContent = cantidad;
        const carritoVacio = cantidad === '0';
        notificacionCarrito.style.display = carritoVacio ? 'none' : 'flex';
        notificacionCarrito.setAttribute('aria-hidden', carritoVacio ? 'true' : 'false');
    }
}

/**
 * Agregar artículo al carrito
 */
function agregarAlCarrito() {
    let cantidad = parseInt(obtenerCantidadCarrito());
    cantidad++;
    localStorage.setItem('cantidadCarrito', cantidad);
    actualizarNotificacionCarrito();
}

/**
 * Manejar click en botón del carrito
 */
if (botonCarrito) {
    botonCarrito.addEventListener('click', () => {
        console.log('Carrito de compras - Cantidad:', obtenerCantidadCarrito());
        // Aquí implementar navegación a página del carrito o mostrar modal
        // window.location.href = '/carrito';
    });
}

// ========== AUTENTICACIÓN DE USUARIO ==========

/**
 * Manejar click en botón Iniciar Sesión
 */
botonesIniciarSesion.forEach(botonIniciarSesion => {
    botonIniciarSesion.addEventListener('click', () => {
        console.log('Iniciar sesión');
        // Aquí implementar modal o navegación a página de login
        // window.location.href = '/login';
    });
});

/**
 * Manejar click en botón Registrarse
 */
botonesRegistrarse.forEach(botonRegistrarse => {
    botonRegistrarse.addEventListener('click', () => {
        console.log('Registrarse');
        // Aquí implementar modal o navegación a página de registro
        // window.location.href = '/registro';
    });
});
// ========== NAVEGACIÓN MÓVIL ==========

/**
 * Alternar menú móvil
 */
function alternarMenuMovil() {
    botonHamburguesa.classList.toggle('activo');
    menuNavegacion.classList.toggle('activo');
    document.body.style.overflow = menuNavegacion.classList.contains('activo') ? 'hidden' : '';
}

/**
 * Cerrar menú móvil al hacer click en un enlace
 */
function cerrarMenuMovil() {
    if (window.innerWidth <= 1023) {
        botonHamburguesa.classList.remove('activo');
        menuNavegacion.classList.remove('activo');
        document.body.style.overflow = '';
    }
}

// Event listeners para navegación móvil
if (botonHamburguesa) {
    botonHamburguesa.addEventListener('click', alternarMenuMovil);
}

enlacesNavegacion.forEach(link => {
    link.addEventListener('click', cerrarMenuMovil);
});

// Cerrar menú al hacer click fuera
document.addEventListener('click', (e) => {
    if (menuNavegacion && menuNavegacion.classList.contains('activo')) {
        if (!menuNavegacion.contains(e.target) && !botonHamburguesa.contains(e.target)) {
            cerrarMenuMovil();
        }
    }
});

// ========== NAVEGACIÓN ACTIVA ==========

/**
 * Marcar un único enlace como activo
 */
function establecerEnlaceActivo(enlaceActivo) {
    enlacesNavegacion.forEach(link => link.classList.remove('activo'));

    if (enlaceActivo) {
        enlaceActivo.classList.add('activo');
    }
}

/**
 * Actualizar enlace activo según la sección visible
 */
function actualizarEnlaceActivo() {
    if (navegacionManualActiva) {
        return;
    }

    const navbar = document.querySelector('.barra-navegacion');
    const offsetNavbar = navbar ? navbar.offsetHeight : 0;
    const posicionActual = window.pageYOffset + offsetNavbar + 80;
    let enlaceActivo = null;

    enlacesNavegacion.forEach(link => {
        const href = link.getAttribute('href');

        if (href && href.startsWith('#')) {
            const seccion = document.getElementById(href.substring(1));

            if (seccion && seccion.offsetTop <= posicionActual) {
                enlaceActivo = link;
            }
        }
    });

    establecerEnlaceActivo(enlaceActivo || enlacesNavegacion[0]);
}

// ========== SCROLL SUAVE ==========

/**
 * Scroll suave para enlaces internos
 */
enlacesNavegacion.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                establecerEnlaceActivo(link);
                navegacionManualActiva = true;
                clearTimeout(temporizadorNavegacionManual);

                const finalizarNavegacionManual = () => {
                    clearTimeout(temporizadorNavegacionManual);
                    navegacionManualActiva = false;
                    actualizarEnlaceActivo();
                };

                if ('onscrollend' in window) {
                    window.addEventListener('scrollend', finalizarNavegacionManual, { once: true });
                }

                temporizadorNavegacionManual = setTimeout(finalizarNavegacionManual, 1400);

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
    const navbar = document.querySelector('.barra-navegacion');
    
    if (window.scrollY > 50) {
        navbar.style.boxShadow = 'var(--shadow-lg)';
        navbar.style.backgroundColor = 'var(--bg-overlay)';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.backgroundColor = 'var(--bg-secondary)';
    }
}

// ========== REVELACIÓN AL DESPLAZAR ==========

/**
 * Revelar elementos al hacer scroll
 */
function revelarAlDesplazar() {
    const elementos = document.querySelectorAll('.revelacion-scroll');
    
    elementos.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('revelado');
        }
    });
}

// ========== BÚSQUEDA ==========

/**
 * Manejar búsqueda (placeholder - implementar según necesidades)
 */
if (entradaBusqueda) {
    entradaBusqueda.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = entradaBusqueda.value.trim();
            
            if (searchTerm) {
                console.log('Buscando:', searchTerm);
                // Aquí implementar la lógica de búsqueda
                // Por ejemplo: redirigir a página de resultados
                // window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
            }
        }
    });
    
    // Botón de búsqueda
    const searchBtn = document.querySelector('.boton-busqueda');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = entradaBusqueda.value.trim();
            
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
function inicializarTarjetasDestino() {
    const cards = document.querySelectorAll('.tarjeta-destino');
    
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
function inicializarBotonesCTA() {
    const ctaButtons = document.querySelectorAll('.llamada-accion .boton');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            console.log('CTA clicked:', buttonText);
            
            // Implementar acciones según el botón
            if (buttonText.includes('Planes')) {
                // Scroll a sección de destinos
                const destinationsSection = document.getElementById('planes-populares');
                if (destinationsSection) {
                    destinationsSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (buttonText.includes('Personalizado')) {
                // Navegar a ofertas o mostrar modal
                const destinationsSection = document.getElementById('plan-personalizado');
                if (destinationsSection) {
                    destinationsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// ========== CARGA PEREZOSA DE IMÁGENES ==========

/**
 * Carga perezosa para imágenes (si se agregan en el futuro)
 */
function inicializarCargaPerezosa() {
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

// ========== CAMBIO DE TEMA (Opcional) ==========

/**
 * Alternar entre tema claro y oscuro
 */
function inicializarCambioTema() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Si agregas un botón de alternar tema:
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
    actualizarEnlaceActivo();
    handleNavbarScroll();
    revelarAlDesplazar();
}));

// Resize events
window.addEventListener('resize', debounce(() => {
    // Cerrar menú móvil si se cambia a desktop
    if (window.innerWidth > 1023 && menuNavegacion.classList.contains('activo')) {
        cerrarMenuMovil();
    }
}));

// ========== INICIALIZACIÓN ==========

/**
 * Inicializar todas las funcionalidades cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 FlyGo inicializado correctamente');
    
    // Inicializar componentes
    inicializarTarjetasDestino();
    inicializarBotonesCTA();
    inicializarCargaPerezosa();
    inicializarCambioTema();
    actualizarNotificacionCarrito();
    
    // Ejecutar funciones iniciales
    actualizarEnlaceActivo();
    handleNavbarScroll();
    revelarAlDesplazar();
    
    // Agregar clase para animaciones de entrada
    document.body.classList.add('cargado');
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
// export { alternarMenuMovil, actualizarEnlaceActivo, debounce, throttle };


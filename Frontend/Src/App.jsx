import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import FloatingAiPlanner from './components/FloatingAiPlanner.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function App() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [location.pathname]);

    useEffect(() => {
        const revealTargets = document.querySelectorAll(
            '.seccion-personalizado, .seccion-destinos, .tarjeta-destino, .beneficio-card, .docs-card, .panel-ofertas div, .resultado-plan, .detalle-paquete__grid article, .item-carrito, .auth-card'
        );

        revealTargets.forEach((target) => target.classList.add('revelacion-scroll'));

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revelado');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
        );

        revealTargets.forEach((target) => observer.observe(target));

        return () => observer.disconnect();
    }, [location.pathname]);

    return (
        <>
            <div className="ambiente-sitio" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <Navbar />
            <main>
                <AppRoutes />
            </main>
            <FloatingAiPlanner />
            <Footer />
        </>
    );
}

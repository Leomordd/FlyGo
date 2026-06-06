import { Link } from 'react-router-dom';
import logoIcon from '../Assets/icon/logotipo (1).png';

export default function Footer() {
    const docs = [
        {
            title: 'Frontend',
            text: 'React + Vite con rutas en Src/routes/AppRoutes.jsx y vistas en Src/pages.'
        },
        {
            title: 'Datos',
            text: 'Los paquetes se exponen tambien por /api/packages para unificar la lectura desde el backend.'
        },
        {
            title: 'Estado',
            text: 'AuthContext guarda token real y CartContext sincroniza el carrito del usuario autenticado.'
        }
    ];

    return (
        <footer className="pie-pagina">
            <div className="contenedor">
                <div className="contenido-pie-pagina">
                    <div className="marca-pie-pagina">
                        <img src={logoIcon} alt="Logotipo de FlyGo" className="logotipo-pie-pagina" />
                        <p>Tu companero de viajes perfecto</p>
                    </div>
                    <div className="enlaces-pie-pagina">
                        <h4>Enlaces rapidos</h4>
                        <ul>
                            <li><Link to="/">Inicio</Link></li>
                            <li><Link to="/planes">Planes</Link></li>
                            <li><Link to="/ofertas">Ofertas</Link></li>
                            <li><Link to="/plan-personalizado">Plan personalizado</Link></li>
                            <li><Link to="/documentacion">Documentacion</Link></li>
                        </ul>
                    </div>
                    <div className="social-pie-pagina">
                        <h4>Siguenos</h4>
                        <div className="enlaces-sociales">
                            <a href="#" aria-label="Facebook">FB</a>
                            <a href="#" aria-label="Twitter">TW</a>
                            <a href="#" aria-label="Instagram">IG</a>
                        </div>
                    </div>
                </div>
                <section className="documentacion-footer" aria-labelledby="documentacion-footer-titulo">
                    <div>
                        <span className="etiqueta-plan">Documentacion</span>
                        <h3 id="documentacion-footer-titulo">Mapa tecnico del sitio</h3>
                        <p>Resumen rapido para entender y seguir desarrollando FlyGo.</p>
                    </div>
                    <div className="documentacion-footer__grid">
                        {docs.map((item) => (
                            <article key={item.title}>
                                <strong>{item.title}</strong>
                                <p>{item.text}</p>
                            </article>
                        ))}
                    </div>
                    <Link className="boton boton-secundario" to="/documentacion">Ver documentacion completa</Link>
                </section>
                <div className="pie-inferior">
                    <p>&copy; 2026 FlyGo. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

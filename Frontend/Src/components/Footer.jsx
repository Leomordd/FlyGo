import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="pie-pagina">
            <div className="contenedor">
                <div className="contenido-pie-pagina">
                    <div className="marca-pie-pagina">
                        <img src="/Src/Assets/icon/logotipo%20(1).png" alt="Logotipo de FlyGo" className="logotipo-pie-pagina" />
                        <p>Tu companero de viajes perfecto</p>
                    </div>
                    <div className="enlaces-pie-pagina">
                        <h4>Enlaces rapidos</h4>
                        <ul>
                            <li><Link to="/">Inicio</Link></li>
                            <li><Link to="/planes">Planes</Link></li>
                            <li><Link to="/ofertas">Ofertas</Link></li>
                            <li><Link to="/plan-personalizado">Plan personalizado</Link></li>
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
                <div className="pie-inferior">
                    <p>&copy; 2026 FlyGo. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

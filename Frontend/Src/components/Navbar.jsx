import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useCart from '../hooks/useCart.js';
import useAuth from '../hooks/useAuth.js';
import logoIcon from '../Assets/icon/logotipo (1).png';
import logoText from '../Assets/icon/logotexto.png';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { totalItems } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const closeMenu = () => setIsMenuOpen(false);
    const handleSearch = (event) => {
        event.preventDefault();
        const query = searchTerm.trim();

        if (query) {
            navigate(`/buscar?q=${encodeURIComponent(query)}`);
            closeMenu();
        }
    };

    return (
        <nav className="barra-navegacion">
            <div className="contenedor-navegacion">
                <Link className="marca-navegacion" to="/" onClick={closeMenu}>
                    <img src={logoIcon} alt="Logotipo de FlyGo" className="logotipo" />
                    <img src={logoText} alt="FlyGo" className="logotipo-movil" />
                </Link>

                <ul className={`menu-navegacion ${isMenuOpen ? 'activo' : ''}`}>
                    <li className="elemento-menu">
                        <NavLink className={({ isActive }) => `enlace-navegacion ${isActive ? 'activo' : ''}`} to="/" onClick={closeMenu}>Inicio</NavLink>
                    </li>
                    <li className="elemento-menu">
                        <NavLink className={({ isActive }) => `enlace-navegacion ${isActive ? 'activo' : ''}`} to="/planes" onClick={closeMenu}>Planes</NavLink>
                    </li>
                    <li className="elemento-menu">
                        <NavLink className={({ isActive }) => `enlace-navegacion ${isActive ? 'activo' : ''}`} to="/ofertas" onClick={closeMenu}>Ofertas</NavLink>
                    </li>
                    <li className="elemento-menu">
                        <NavLink className={({ isActive }) => `enlace-navegacion ${isActive ? 'activo' : ''}`} to="/plan-personalizado" onClick={closeMenu}>Plan</NavLink>
                    </li>
                    <li className="acciones-menu-movil">
                        {user ? (
                            <button className="boton boton-iniciar-sesion" type="button" onClick={() => { logout(); closeMenu(); }}>Salir</button>
                        ) : (
                            <>
                                <Link className="boton boton-iniciar-sesion" to="/login" onClick={closeMenu}>Iniciar Sesion</Link>
                                <Link className="boton boton-registrarse" to="/registro" onClick={closeMenu}>Registrarse</Link>
                            </>
                        )}
                    </li>
                </ul>

                <form className="busqueda-navegacion" onSubmit={handleSearch}>
                    <input
                        className="entrada-busqueda"
                        type="search"
                        placeholder="Buscar destinos..."
                        aria-label="Buscar destinos"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                    <button className="boton-busqueda" aria-label="Buscar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </button>
                </form>

                <div className="acciones-usuario">
                    <Link className="boton boton-carrito" to="/carrito" aria-label="Carrito de compras">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        {totalItems > 0 && <span className="notificacion-carrito notificacion-carrito--visible">{totalItems}</span>}
                    </Link>
                    {user ? (
                        <>
                            <span className="usuario-navbar">{user.firstName || user.email}</span>
                            <button className="boton boton-iniciar-sesion" type="button" onClick={logout}>Salir</button>
                        </>
                    ) : (
                        <>
                            <Link className="boton boton-iniciar-sesion" to="/login">Iniciar Sesion</Link>
                            <Link className="boton boton-registrarse" to="/registro">Registrarse</Link>
                        </>
                    )}
                </div>

                <button
                    className={`boton-hamburguesa ${isMenuOpen ? 'activo' : ''}`}
                    aria-label="Abrir menu"
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen((current) => !current)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}

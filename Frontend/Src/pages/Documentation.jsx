import { Link } from 'react-router-dom';

const sections = [
    {
        title: 'Estructura del frontend',
        text: 'La app empieza en index.html, monta React desde Src/main.jsx y muestra App.jsx con navbar, rutas y footer.'
    },
    {
        title: 'Rutas principales',
        text: 'Inicio, planes, ofertas, busqueda, plan personalizado, carrito, login, registro, detalle de paquete y pagina 404.'
    },
    {
        title: 'Datos actuales',
        text: 'Los paquetes se sirven desde el backend y mantienen la misma estructura usada por las vistas actuales.'
    },
    {
        title: 'Estado global',
        text: 'AuthContext persiste token firmado y CartContext sincroniza el carrito con /api/cart.'
    }
];

export default function Documentation() {
    return (
        <section className="pagina-app">
            <div className="contenedor docs-layout">
                <span className="etiqueta-plan">Guia del proyecto</span>
                <h1 className="titulo-seccion">Documentacion de FlyGo</h1>
                <p className="subtitulo-seccion">
                    Esta pagina resume como esta armada la aplicacion y que piezas ya estan conectadas con backend.
                </p>

                <div className="docs-grid">
                    {sections.map((section) => (
                        <article className="docs-card" key={section.title}>
                            <h2>{section.title}</h2>
                            <p>{section.text}</p>
                        </article>
                    ))}
                </div>

                <div className="docs-card docs-card--full">
                    <h2>Integraciones reales</h2>
                    <p>
                        Registro, inicio de sesion, carrito, reservas, comentarios, resenas y checkout usan endpoints
                        reales. PayPal y Mercado Pago quedan listos para operar al cargar las credenciales del proveedor.
                    </p>
                    <div className="detalle-paquete__acciones">
                        <Link className="boton boton-primario" to="/plan-personalizado">Probar formulario</Link>
                        <Link className="boton boton-secundario" to="/planes">Ver planes</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

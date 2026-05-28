import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <section className="pagina-app pagina-not-found">
            <div className="contenedor bloque-centrado">
                <span className="etiqueta-plan">404</span>
                <h1 className="titulo-seccion">Pagina no encontrada</h1>
                <p className="subtitulo-seccion">
                    La ruta que intentaste abrir no existe en FlyGo. Puedes volver al inicio o revisar los planes disponibles.
                </p>
                <div className="detalle-paquete__acciones">
                    <Link className="boton boton-primario" to="/">Ir al inicio</Link>
                    <Link className="boton boton-secundario" to="/planes">Ver planes</Link>
                </div>
            </div>
        </section>
    );
}

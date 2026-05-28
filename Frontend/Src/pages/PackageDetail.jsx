import { Link, useParams } from 'react-router-dom';
import useCart from '../hooks/useCart.js';
import { packages } from '../data/packages.js';

export default function PackageDetail() {
    const { packageId } = useParams();
    const { addItem } = useCart();
    const packageItem = packages.find((item) => item.id === packageId);

    if (!packageItem) {
        return (
            <section className="pagina-app">
                <div className="contenedor bloque-centrado">
                    <span className="etiqueta-plan">Plan no encontrado</span>
                    <h1 className="titulo-seccion">Ese paquete no existe</h1>
                    <p className="subtitulo-seccion">Puede que el enlace este mal escrito o que el plan ya no este disponible.</p>
                    <Link className="boton boton-primario" to="/planes">Volver a planes</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="pagina-app">
            <div className="contenedor detalle-paquete">
                <div className="detalle-paquete__hero">
                    <span className="etiqueta-plan">{packageItem.tag}</span>
                    <h1>{packageItem.title}</h1>
                    <p>{packageItem.description}</p>
                    <div className="detalle-paquete__acciones">
                        <button className="boton boton-primario" onClick={() => addItem(packageItem)}>Agregar al carrito</button>
                        <Link className="boton boton-secundario" to="/plan-personalizado">Personalizar parecido</Link>
                    </div>
                </div>

                <aside className="detalle-paquete__resumen">
                    <strong>Desde ${packageItem.price}</strong>
                    <span>{packageItem.destination}</span>
                    <span>{packageItem.days} dias</span>
                    <span>Asistencia incluida</span>
                </aside>

                <div className="detalle-paquete__grid">
                    <article>
                        <h2>Incluye</h2>
                        <ul>
                            <li>Vuelo o traslado base segun disponibilidad.</li>
                            <li>Alojamiento seleccionado por zona y presupuesto.</li>
                            <li>Itinerario inicial con actividades recomendadas.</li>
                            <li>Soporte de FlyGo antes y durante el viaje.</li>
                        </ul>
                    </article>
                    <article>
                        <h2>Ideal para</h2>
                        <ul>
                            <li>Viajeros que quieren una reserva simple.</li>
                            <li>Personas que comparan planes antes de decidir.</li>
                            <li>Grupos que necesitan precio claro desde el inicio.</li>
                        </ul>
                    </article>
                </div>
            </div>
        </section>
    );
}

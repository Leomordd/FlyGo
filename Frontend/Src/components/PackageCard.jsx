import useCart from '../hooks/useCart.js';

export default function PackageCard({ packageItem }) {
    const { addItem } = useCart();

    return (
        <article className="tarjeta-destino paquete-card">
            <div className="imagen-tarjeta paquete-card__imagen">
                <span>{packageItem.tag}</span>
            </div>
            <div className="contenido-tarjeta">
                <div>
                    <h3>{packageItem.title}</h3>
                    <p>{packageItem.description}</p>
                    <small>{packageItem.destination} - {packageItem.days} dias</small>
                </div>
                <span className="precio">Desde ${packageItem.price}</span>
            </div>
            <div className="paquete-card__acciones">
                <button className="boton boton-secundario">Ver detalle</button>
                <button className="boton boton-primario" onClick={() => addItem(packageItem)}>Agregar</button>
            </div>
        </article>
    );
}

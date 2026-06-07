import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart.js';
import useCurrency from '../hooks/useCurrency.js';

export default function PackageCard({ packageItem }) {
    const { addItem } = useCart();
    const { formatPrice } = useCurrency();

    return (
        <article className="tarjeta-destino paquete-card">
            <div
                className="imagen-tarjeta paquete-card__imagen"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(14, 16, 21, 0.08), rgba(14, 16, 21, 0.58)), url(${packageItem.image})` }}
            >
                <span>{packageItem.tag}</span>
            </div>
            <div className="contenido-tarjeta">
                <div>
                    <h3>{packageItem.title}</h3>
                    <p>{packageItem.description}</p>
                    <small>{packageItem.destination} - {packageItem.days} dias</small>
                </div>
                <span className="precio">Desde {formatPrice(packageItem.price)}</span>
            </div>
            <div className="paquete-card__acciones">
                <Link className="boton boton-secundario" to={`/planes/${packageItem.id}`}>Ver detalle</Link>
                <button className="boton boton-primario" onClick={() => addItem(packageItem)}>Agregar</button>
            </div>
        </article>
    );
}

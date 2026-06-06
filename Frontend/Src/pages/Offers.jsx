import PackageCard from '../components/PackageCard.jsx';
import usePackages from '../hooks/usePackages.js';

export default function Offers() {
    const { packages, error } = usePackages();
    const offers = packages.filter((packageItem) => packageItem.type === 'offer');

    return (
        <section className="pagina-app">
            <div className="contenedor">
                <span className="etiqueta-plan">Promos activas</span>
                <h1 className="titulo-seccion">Ofertas de temporada</h1>
                <p className="subtitulo-seccion">Descuentos, cupos limitados y viajes destacados listos para reservar.</p>
                {error && <p className="mensaje-error">Mostrando respaldo local: {error}</p>}
                <div className="panel-ofertas">
                    <div>
                        <strong>Hasta 35% OFF</strong>
                        <span>Reservas anticipadas y paquetes flexibles.</span>
                    </div>
                    <div>
                        <strong>12 cuotas</strong>
                        <span>Financiacion preparada para integrar con pagos.</span>
                    </div>
                    <div>
                        <strong>Asistencia</strong>
                        <span>Soporte durante todo el viaje.</span>
                    </div>
                </div>
                <div className="cuadricula-destinos">
                    {offers.map((packageItem) => (
                        <PackageCard key={packageItem.id} packageItem={packageItem} />
                    ))}
                </div>
            </div>
        </section>
    );
}

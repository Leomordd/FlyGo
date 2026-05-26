import PackageCard from '../components/PackageCard.jsx';
import { packages } from '../data/packages.js';

export default function Packages() {
    return (
        <section className="pagina-app">
            <div className="contenedor">
                <span className="etiqueta-plan">Catalogo</span>
                <h1 className="titulo-seccion">Planes disponibles</h1>
                <p className="subtitulo-seccion">Una primera version del listado de paquetes para conectar despues con el backend.</p>
                <div className="cuadricula-destinos">
                    {packages.map((packageItem) => (
                        <PackageCard key={packageItem.id} packageItem={packageItem} />
                    ))}
                </div>
            </div>
        </section>
    );
}

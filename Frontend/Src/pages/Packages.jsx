import PackageCard from '../components/PackageCard.jsx';
import usePackages from '../hooks/usePackages.js';

export default function Packages() {
    const { packages, error } = usePackages();

    return (
        <section className="pagina-app">
            <div className="contenedor">
                <span className="etiqueta-plan">Catalogo</span>
                <h1 className="titulo-seccion">Planes disponibles</h1>
                <p className="subtitulo-seccion">Paquetes cargados desde el backend con respaldo local para desarrollo.</p>
                {error && <p className="mensaje-error">Mostrando respaldo local: {error}</p>}
                <div className="cuadricula-destinos">
                    {packages.map((packageItem) => (
                        <PackageCard key={packageItem.id} packageItem={packageItem} />
                    ))}
                </div>
            </div>
        </section>
    );
}

import { Link, useSearchParams } from 'react-router-dom';
import PackageCard from '../components/PackageCard.jsx';
import usePackages from '../hooks/usePackages.js';

export default function Search() {
    const { packages, error } = usePackages();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q')?.trim() || '';
    const normalizedQuery = query.toLowerCase();
    const results = normalizedQuery
        ? packages.filter((packageItem) => (
            packageItem.title.toLowerCase().includes(normalizedQuery)
            || packageItem.destination.toLowerCase().includes(normalizedQuery)
            || packageItem.description.toLowerCase().includes(normalizedQuery)
            || packageItem.tag.toLowerCase().includes(normalizedQuery)
        ))
        : packages;

    return (
        <section className="pagina-app">
            <div className="contenedor">
                <span className="etiqueta-plan">Busqueda</span>
                <h1 className="titulo-seccion">{query ? `Resultados para "${query}"` : 'Buscar viajes'}</h1>
                <p className="subtitulo-seccion">
                    Filtramos los paquetes por destino, nombre, descripcion y etiqueta.
                </p>
                {error && <p className="mensaje-error">Mostrando respaldo local: {error}</p>}

                {results.length > 0 ? (
                    <div className="cuadricula-destinos">
                        {results.map((packageItem) => (
                            <PackageCard key={packageItem.id} packageItem={packageItem} />
                        ))}
                    </div>
                ) : (
                    <div className="estado-vacio bloque-centrado">
                        <h2>No encontramos paquetes</h2>
                        <p>Prueba con Paris, Rio, Tokio, playa, cultura u oferta.</p>
                        <Link className="boton boton-primario" to="/planes">Ver todos los planes</Link>
                    </div>
                )}
            </div>
        </section>
    );
}

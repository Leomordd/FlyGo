import { Link } from 'react-router-dom';
import PackageCard from '../components/PackageCard.jsx';
import { packages } from '../data/packages.js';

export default function Home() {
    const popularPackages = packages.filter((packageItem) => packageItem.type === 'popular').slice(0, 3);

    return (
        <>
            <section className="seccion-inicio">
                <div className="contenido-inicio">
                    <h1 className="titulo-inicio">Descubre el Mundo con FlyGo</h1>
                    <p className="subtitulo-inicio">Encuentra los mejores destinos y ofertas para tu proxima aventura</p>
                    <div className="llamada-accion">
                        <Link className="boton boton-primario" to="/plan-personalizado">Plan Personalizado</Link>
                        <Link className="boton boton-secundario" to="/planes">Planes Populares</Link>
                    </div>
                </div>
                <div className="decoracion-inicio"></div>
            </section>

            <section className="seccion-personalizado">
                <div className="encabezado-plan">
                    <span className="etiqueta-plan">Viaje a tu medida</span>
                    <h2 className="titulo-inicio-plan">Plan Personalizado</h2>
                    <p>Disena tu viaje ideal segun tu destino, fechas, presupuesto y estilo de viaje.</p>
                </div>

                <div className="contenedor-personalizado">
                    <div className="intro-personalizado">
                        <div>
                            <h3><span></span> Personaliza tu plan</h3>
                            <p>Responde unas pocas preguntas y recibe una propuesta pensada para ti.</p>
                        </div>
                        <Link className="boton boton-plan-personalizado" to="/plan-personalizado">Vamos alla</Link>
                    </div>

                    <div className="beneficios-personalizado">
                        <article className="beneficio-card">
                            <span>01</span>
                            <h4>Destino ideal</h4>
                            <p>Encuentra lugares que se adaptan exactamente a lo que buscas.</p>
                        </article>
                        <article className="beneficio-card">
                            <span>02</span>
                            <h4>Presupuesto claro</h4>
                            <p>Armamos opciones optimizadas para tu bolsillo.</p>
                        </article>
                        <article className="beneficio-card">
                            <span>03</span>
                            <h4>Flexibilidad total</h4>
                            <p>Elige fechas, hoteles y preferencias.</p>
                        </article>
                        <article className="beneficio-card">
                            <span>04</span>
                            <h4>Cero estres</h4>
                            <p>Recibe un itinerario completo listo para disfrutar.</p>
                        </article>
                    </div>
                </div>
            </section>

            <section className="seccion-destinos">
                <div className="contenedor">
                    <span className="etiqueta-plan">Viajes rapidos</span>
                    <h2 className="titulo-seccion">Planes Populares</h2>
                    <p className="subtitulo-seccion">Explora los lugares mas increibles del mundo</p>
                    <div className="cuadricula-destinos">
                        {popularPackages.map((packageItem) => (
                            <PackageCard key={packageItem.id} packageItem={packageItem} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

import TravelQuiz from '../components/TravelQuiz.jsx';

export default function CustomPlan() {
    return (
        <section className="pagina-app seccion-personalizado">
            <div className="encabezado-plan">
                <span className="etiqueta-plan">Planificador</span>
                <h1 className="titulo-inicio-plan">Arma tu plan personalizado</h1>
                <p>Este es el primer ejemplo de flujo: capturar preferencias y luego pedir recomendaciones al backend.</p>
            </div>

            <div className="contenedor-personalizado layout-plan">
                <div>
                    <h2>Tu viaje empieza con 4 datos</h2>
                    <p>Mas adelante esto puede conectarse con `recommendationService`, presupuesto real, hoteles y vuelos.</p>
                    <div className="metricas-personalizado">
                        <div>
                            <strong>1</strong>
                            <span>Preferencias</span>
                        </div>
                        <div>
                            <strong>2</strong>
                            <span>Presupuesto</span>
                        </div>
                        <div>
                            <strong>3</strong>
                            <span>Fechas</span>
                        </div>
                        <div>
                            <strong>4</strong>
                            <span>Propuesta</span>
                        </div>
                    </div>
                </div>
                <TravelQuiz />
            </div>
        </section>
    );
}

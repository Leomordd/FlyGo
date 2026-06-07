import TravelQuiz from '../components/TravelQuiz.jsx';

export default function CustomPlan() {
    return (
        <section className="pagina-app seccion-personalizado">
            <div className="encabezado-plan">
                <span className="etiqueta-plan">IA Gemini</span>
                <h1 className="titulo-inicio-plan">Arma tu plan personalizado perfecto</h1>
                <p>Responde el brief y FlyGo te devuelve destino, itinerario, presupuesto, mejoras y proximos pasos.</p>
            </div>

            <div className="contenedor-personalizado layout-plan">
                <div>
                    <h2>Planificacion por texto libre</h2>
                    <p>Escribi como hablarías con una persona: destino, dias, presupuesto, gustos, cosas a evitar y nivel de comodidad.</p>
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

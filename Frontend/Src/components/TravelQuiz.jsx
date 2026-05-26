export default function TravelQuiz() {
    return (
        <form className="formulario-plan">
            <label>
                Destino ideal
                <select>
                    <option>Playa</option>
                    <option>Ciudad</option>
                    <option>Naturaleza</option>
                    <option>Cultura</option>
                </select>
            </label>
            <label>
                Presupuesto por persona
                <input type="number" placeholder="Ej: 1200" />
            </label>
            <label>
                Fecha estimada
                <input type="date" />
            </label>
            <label>
                Preferencias
                <textarea placeholder="Hotel, excursiones, comidas, ritmo del viaje..." rows="4"></textarea>
            </label>
            <button className="boton boton-plan-personalizado" type="button">Generar propuesta</button>
        </form>
    );
}

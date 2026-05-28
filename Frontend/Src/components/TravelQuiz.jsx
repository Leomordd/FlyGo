import { useState } from 'react';

const initialForm = {
    destinationType: 'Playa',
    budget: '',
    date: '',
    travelers: '2',
    pace: 'Equilibrado',
    preferences: ''
};

export default function TravelQuiz() {
    const [formData, setFormData] = useState(initialForm);
    const [proposal, setProposal] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((currentData) => ({ ...currentData, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const budget = Number(formData.budget) || 0;
        const travelers = Number(formData.travelers) || 1;
        const budgetPerTraveler = Math.round(budget / travelers);
        const level = budgetPerTraveler >= 1200 ? 'premium' : budgetPerTraveler >= 700 ? 'equilibrado' : 'economico';
        const destinationIdeas = {
            Playa: ['Rio de Janeiro', 'Punta Cana', 'Cartagena'],
            Ciudad: ['Nueva York', 'Madrid', 'Buenos Aires'],
            Naturaleza: ['Bariloche', 'Costa Rica', 'Patagonia'],
            Cultura: ['Paris', 'Roma', 'Tokio']
        };

        setProposal({
            title: `Plan ${level} para ${formData.destinationType.toLowerCase()}`,
            destination: destinationIdeas[formData.destinationType][0],
            backup: destinationIdeas[formData.destinationType].slice(1).join(' o '),
            budgetPerTraveler,
            summary: `Salida estimada ${formData.date || 'a definir'}, para ${travelers} viajero${travelers > 1 ? 's' : ''}, con ritmo ${formData.pace.toLowerCase()}.`,
            preferences: formData.preferences || 'Sin preferencias especiales por ahora.'
        });
    };

    return (
        <form className="formulario-plan" onSubmit={handleSubmit}>
            <label>
                Destino ideal
                <select name="destinationType" value={formData.destinationType} onChange={handleChange}>
                    <option>Playa</option>
                    <option>Ciudad</option>
                    <option>Naturaleza</option>
                    <option>Cultura</option>
                </select>
            </label>
            <label>
                Presupuesto total
                <input name="budget" value={formData.budget} onChange={handleChange} type="number" min="0" placeholder="Ej: 2400" required />
            </label>
            <label>
                Fecha estimada
                <input name="date" value={formData.date} onChange={handleChange} type="date" />
            </label>
            <label>
                Viajeros
                <input name="travelers" value={formData.travelers} onChange={handleChange} type="number" min="1" max="12" />
            </label>
            <label>
                Ritmo del viaje
                <select name="pace" value={formData.pace} onChange={handleChange}>
                    <option>Relajado</option>
                    <option>Equilibrado</option>
                    <option>Intenso</option>
                </select>
            </label>
            <label>
                Preferencias
                <textarea name="preferences" value={formData.preferences} onChange={handleChange} placeholder="Hotel, excursiones, comidas, traslados..." rows="4"></textarea>
            </label>
            <button className="boton boton-plan-personalizado" type="submit">Generar propuesta</button>

            {proposal && (
                <section className="resultado-plan" aria-live="polite">
                    <span className="etiqueta-plan">Propuesta inicial</span>
                    <h3>{proposal.title}</h3>
                    <p>{proposal.summary}</p>
                    <ul>
                        <li>Destino sugerido: {proposal.destination}</li>
                        <li>Alternativas: {proposal.backup}</li>
                        <li>Presupuesto por persona: ${proposal.budgetPerTraveler}</li>
                        <li>Notas: {proposal.preferences}</li>
                    </ul>
                </section>
            )}
        </form>
    );
}

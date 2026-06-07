import { useState } from 'react';
import { api } from '../services/apiClient.js';
import PlanResult from './PlanResult.jsx';

const initialForm = {
    prompt: ''
};

export default function TravelQuiz() {
    const [formData, setFormData] = useState(initialForm);
    const [proposal, setProposal] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (event) => {
        setFormData({ prompt: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsGenerating(true);

        try {
            setProposal(await api.createTravelPlan({ prompt: formData.prompt }));
        } catch (planError) {
            setError(planError.message);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <form className="formulario-plan" onSubmit={handleSubmit}>
            <label>
                Escribi lo que queres
                <textarea
                    name="prompt"
                    value={formData.prompt}
                    onChange={handleChange}
                    placeholder="Ej: Quiero un viaje romantico de 6 dias a la playa, para 2 personas, con USD 3000, hotel premium, buenos restaurantes y nada de excursiones agotadoras."
                    rows="7"
                    required
                />
            </label>
            {error && <p className="mensaje-error">{error}</p>}
            <button className="boton boton-ia-gemini" type="submit" disabled={isGenerating}>
                {isGenerating ? 'Gemini esta afinando detalles...' : 'Generar plan con IA Gemini'}
            </button>

            <PlanResult proposal={proposal} />
        </form>
    );
}

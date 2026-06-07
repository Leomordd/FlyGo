import { useState } from 'react';
import { api } from '../services/apiClient.js';
import PlanResult from './PlanResult.jsx';

export default function FloatingAiPlanner() {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [proposal, setProposal] = useState(null);
    const [error, setError] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const text = prompt.trim();
        if (!text) return;

        setError('');
        setIsGenerating(true);

        try {
            setProposal(await api.createTravelPlan({ prompt: text }));
        } catch (planError) {
            setError(planError.message);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className={`ia-flotante ${isOpen ? 'ia-flotante--abierta' : ''}`}>
            {isOpen && (
                <section className="ia-flotante__panel" aria-label="Planificador IA">
                    <div className="ia-flotante__header">
                        <div>
                            <span className="etiqueta-plan">IA Gemini</span>
                            <h2>Decime tu viaje</h2>
                        </div>
                        <button type="button" aria-label="Cerrar IA" onClick={() => setIsOpen(false)}>x</button>
                    </div>
                    <form className="ia-flotante__form" onSubmit={handleSubmit}>
                        <textarea
                            value={prompt}
                            onChange={(event) => setPrompt(event.target.value)}
                            placeholder="Ej: Quiero 7 dias de playa para 2 personas, presupuesto USD 2500, hotel lindo, poca caminata y buena comida."
                            rows="5"
                        />
                        {error && <p className="mensaje-error">{error}</p>}
                        <button className="boton boton-ia-gemini" type="submit" disabled={isGenerating}>
                            {isGenerating ? 'Armando plan...' : 'Crear plan perfecto'}
                        </button>
                    </form>
                    <PlanResult proposal={proposal} />
                </section>
            )}
            <button
                className="ia-flotante__boton"
                type="button"
                aria-label="Abrir IA Gemini"
                onClick={() => setIsOpen((current) => !current)}
            >
                IA
            </button>
        </div>
    );
}

import { useState } from 'react';
import planImage from '../Assets/Img/transreal.png';
import useCart from '../hooks/useCart.js';

function getPlanPrice(proposal) {
    const budgetTotal = (proposal.budgetBreakdown || []).reduce((total, item) => total + Number(item.value || 0), 0);
    return budgetTotal || 2200;
}

function getPlanDays(proposal) {
    return Math.max(1, proposal.itinerary?.length || 7);
}

function createCartItem(proposal) {
    const destination = proposal.destination || 'Destino FlyGo';
    const days = getPlanDays(proposal);

    return {
        id: `ia-${destination.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${days}`,
        title: proposal.title || `Plan IA a ${destination}`,
        destination,
        description: proposal.summary || 'Plan personalizado generado por la IA de FlyGo.',
        price: getPlanPrice(proposal),
        days,
        tag: 'IA FlyGo',
        type: 'custom-ai',
        image: planImage,
        heroImage: planImage,
        aiPlan: {
            alternatives: proposal.alternatives || [],
            itinerary: proposal.itinerary || [],
            upgrades: proposal.upgrades || [],
            nextSteps: proposal.nextSteps || []
        }
    };
}

export default function PlanResult({ proposal }) {
    const { addItem } = useCart();
    const [savedPlanId, setSavedPlanId] = useState('');

    if (!proposal) return null;

    if (proposal.needsClarification) {
        return (
            <section className="resultado-plan resultado-plan--aclaracion" aria-live="polite">
                <span className="etiqueta-plan">IA FlyGo</span>
                <h3>{proposal.title}</h3>
                <p>{proposal.summary}</p>
                <ul>
                    {(proposal.questions || []).map((question) => <li key={question}>{question}</li>)}
                </ul>
            </section>
        );
    }

    const cartItem = createCartItem(proposal);
    const isSaved = savedPlanId === cartItem.id;

    const handleSavePlan = () => {
        addItem(cartItem);
        setSavedPlanId(cartItem.id);
    };

    return (
        <section className="resultado-plan" aria-live="polite">
            <span className="etiqueta-plan">{proposal.provider === 'gemini' ? 'Gemini activo' : 'FlyGo IA local'}</span>
            <h3>{proposal.title}</h3>
            <strong className="puntaje-plan">{proposal.score}/100 match</strong>
            <p>{proposal.summary}</p>
            <button className="boton boton-ia-gemini resultado-plan__guardar" type="button" onClick={handleSavePlan}>
                {isSaved ? 'Guardado en carrito' : 'Guardar este viaje en el carrito'}
            </button>
            <div className="plan-grid">
                <article>
                    <h4>Destino ganador</h4>
                    <p>{proposal.destination}</p>
                    <small>Alternativas: {(proposal.alternatives || []).join(', ') || 'a definir'}</small>
                </article>
                <article>
                    <h4>Mejoras incluidas</h4>
                    <ul>{(proposal.upgrades || []).map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
            </div>
            <div className="itinerario-plan">
                <h4>Itinerario dia por dia</h4>
                {(proposal.itinerary || []).map((day) => (
                    <article key={day.day}>
                        <span>Dia {day.day}</span>
                        <div>
                            <strong>{day.title}</strong>
                            <p>{day.detail}</p>
                        </div>
                    </article>
                ))}
            </div>
            <div className="plan-grid">
                <article>
                    <h4>Presupuesto</h4>
                    <ul>{(proposal.budgetBreakdown || []).map((item) => <li key={item.label}>{item.label}: USD {item.value}</li>)}</ul>
                </article>
                <article>
                    <h4>Proximos pasos</h4>
                    <ul>{(proposal.nextSteps || []).map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
            </div>
        </section>
    );
}

import { recommendationsRepository } from './recommendations.repository.js';
import { env } from '../../config/env.js';

const destinationIdeas = {
    Playa: ['Rio de Janeiro', 'Punta Cana', 'Cartagena'],
    Ciudad: ['Nueva York', 'Madrid', 'Buenos Aires'],
    Naturaleza: ['Bariloche', 'Costa Rica', 'Patagonia'],
    Cultura: ['Paris', 'Roma', 'Tokio'],
    Sorpresa: ['Lisboa', 'Costa Rica', 'Marrakech']
};

function tokenize(prompt) {
    return String(prompt || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .split(/[^a-z0-9]+/)
        .filter(Boolean);
}

function promptQuality(payload) {
    const prompt = String(payload.prompt || payload.text || payload.preferences || '');
    const words = tokenize(prompt);
    const travelWords = ['viaje', 'viajar', 'viajero', 'viajeros', 'destino', 'lugar', 'lugares', 'playa', 'mar', 'ciudad', 'naturaleza', 'montana', 'bosque', 'cultura', 'hotel', 'hostel', 'vuelo', 'vuelos', 'comida', 'restaurante', 'dias', 'noches', 'personas', 'presupuesto', 'usd', 'dolares', 'escapada', 'vacaciones', 'turismo', 'pais'];
    const styleWords = ['frio', 'fria', 'calor', 'calido', 'calida', 'nieve', 'invierno', 'verano', 'tranquilo', 'tranquila', 'relajado', 'relajada', 'lujo', 'barato', 'economico', 'romantico', 'romantica', 'aventura', 'familiar', 'premium', 'gastronomia', 'gastronomico', 'playero', 'historico'];
    const intentWords = ['quiero', 'quisiera', 'busco', 'necesito', 'recomendame', 'recomienda', 'armame', 'crear', 'plan'];
    const nonsenseWords = ['asdf', 'qwer', 'test', 'prueba', 'nada', 'insulto'];
    const vagueWords = ['cualquier', 'cualquiera', 'algo', 'nose'];
    const travelScore = words.filter((word) => travelWords.includes(word)).length;
    const styleScore = words.filter((word) => styleWords.includes(word)).length;
    const intentScore = words.filter((word) => intentWords.includes(word)).length;
    const nonsenseScore = words.filter((word) => nonsenseWords.includes(word)).length;
    const vagueScore = words.filter((word) => vagueWords.includes(word)).length;
    const hasNumber = /\d/.test(prompt);
    const hasEnoughWords = words.length >= 3;
    const hasTravelIntent = travelScore > 0 || styleScore > 0 || (intentScore > 0 && hasNumber);
    const isOnlyVague = vagueScore > 0 && travelScore === 0 && styleScore === 0 && !hasNumber;
    const isLikelyNonsense = nonsenseScore > 0 || words.some((word) => /(.)\1{4,}/.test(word));

    if (!hasEnoughWords || !hasTravelIntent || isOnlyVague || isLikelyNonsense) {
        return {
            isUsable: false,
            message: 'Necesito que el pedido tenga sentido de viaje. Podes escribir algo general como "quiero un lugar frio", "busco playa barata" o "armame una escapada tranquila".'
        };
    }

    return { isUsable: true };
}

function inferFromPrompt(payload) {
    const prompt = String(payload.prompt || payload.text || '').toLowerCase();
    if (!prompt) return payload;

    const budgetMatch = prompt.match(/(?:usd|dolares|\$)\s*(\d{3,6})|(\d{3,6})\s*(?:usd|dolares)/);
    const travelersMatch = prompt.match(/(\d{1,2})\s*(?:personas|viajeros|amigos|adultos)/);
    const daysMatch = prompt.match(/(\d{1,2})\s*(?:dias|noches)/);
    const destinationType = prompt.includes('playa') || prompt.includes('mar')
        ? 'Playa'
        : prompt.includes('ciudad') || prompt.includes('museo') || prompt.includes('compras')
            ? 'Ciudad'
            : prompt.includes('naturaleza') || prompt.includes('montana') || prompt.includes('bosque') || prompt.includes('frio') || prompt.includes('fria') || prompt.includes('nieve') || prompt.includes('invierno')
                ? 'Naturaleza'
                : prompt.includes('cultura') || prompt.includes('historia')
                    ? 'Cultura'
                    : 'Sorpresa';

    return {
        ...payload,
        destinationType: payload.destinationType || destinationType,
        budget: payload.budget || budgetMatch?.[1] || budgetMatch?.[2] || 2200,
        travelers: payload.travelers || travelersMatch?.[1] || 2,
        days: payload.days || daysMatch?.[1] || 7,
        pace: payload.pace || (prompt.includes('tranquilo') || prompt.includes('relajado') ? 'Relajado' : prompt.includes('intenso') ? 'Intenso' : 'Equilibrado'),
        preferences: payload.preferences || payload.prompt || payload.text
    };
}

function localPlan(payload) {
    const quality = promptQuality(payload);
    if (!quality.isUsable) {
        return {
            provider: env.geminiApiKey ? 'fallback' : 'flygo-local',
            needsClarification: true,
            title: 'Necesito mas datos para armar el plan',
            score: 0,
            summary: quality.message,
            questions: [
                'Que tipo de viaje queres: playa, ciudad, naturaleza, cultura o sorpresa?',
                'Cuantos dias y cuantas personas viajan?',
                'Cual es el presupuesto aproximado y que cosas queres evitar?'
            ]
        };
    }

    const inferred = inferFromPrompt(payload);
    const travelers = Math.max(1, Number(inferred.travelers || 1));
    const budget = Math.max(0, Number(inferred.budget || 0));
    const days = Math.max(3, Number(inferred.days || 7));
    const budgetPerTraveler = Math.round(budget / travelers);
    const style = inferred.destinationType || 'Sorpresa';
    const destinations = destinationIdeas[style] || destinationIdeas.Sorpresa;
    const level = budgetPerTraveler >= 1600 ? 'premium absoluto' : budgetPerTraveler >= 900 ? 'equilibrado superior' : 'inteligente y optimizado';

    return {
        provider: env.geminiApiKey ? 'fallback' : 'flygo-local',
        title: `Plan ${level} para ${travelers} viajero${travelers > 1 ? 's' : ''}`,
        destination: destinations[0],
        alternatives: destinations.slice(1),
        score: 97,
        summary: `Un viaje de ${days} dias con ritmo ${String(inferred.pace || 'Equilibrado').toLowerCase()}, presupuesto por persona de USD ${budgetPerTraveler || 'a definir'} y foco en ${String(inferred.preferences || 'experiencias memorables')}.`,
        itinerary: Array.from({ length: days }).map((_, index) => ({
            day: index + 1,
            title: index === 0 ? 'Llegada impecable' : index === days - 1 ? 'Cierre sin apuro' : `Experiencia curada ${index}`,
            detail: index === 0
                ? 'Traslado coordinado, check-in comodo, caminata liviana y cena de bienvenida.'
                : index === days - 1
                    ? 'Desayuno tranquilo, compras finales, margen para traslados y regreso sin correr.'
                    : `Actividad principal por la manana, pausa estrategica, experiencia local por la tarde y cena recomendada.`
        })),
        budgetBreakdown: [
            { label: 'Alojamiento', value: Math.round(budget * 0.38) },
            { label: 'Vuelos y traslados', value: Math.round(budget * 0.32) },
            { label: 'Comidas', value: Math.round(budget * 0.16) },
            { label: 'Experiencias', value: Math.round(budget * 0.1) },
            { label: 'Margen inteligente', value: Math.round(budget * 0.04) }
        ],
        upgrades: [
            'Seguro de viaje y asistencia 24/7',
            'Habitacion con mejor ubicacion disponible',
            'Reserva anticipada de experiencias con alta demanda',
            'Plan B por clima y cambios de horario'
        ],
        nextSteps: [
            'Confirmar documentos y preferencias alimentarias',
            'Elegir metodo de pago',
            'Recibir voucher y detalle final por email'
        ]
    };
}

async function geminiPlan(payload) {
    const quality = promptQuality(payload);
    if (!quality.isUsable) return localPlan(payload);

    const inferred = inferFromPrompt(payload);
    if (!env.geminiApiKey) return localPlan(inferred);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `Crea un plan de viaje premium en JSON valido, sin markdown, con title, destination, alternatives, score, summary, itinerary, budgetBreakdown, upgrades y nextSteps. Si el pedido es general pero tiene intencion de viaje, no pidas mas detalles: asumi dias, presupuesto y viajeros razonables. Solo rechazarias pedidos sin sentido o sin relacion con viajar, pero esos ya fueron filtrados antes. Interpreta este pedido libre y completalo profesionalmente: ${JSON.stringify(inferred)}`
                }]
            }]
        })
    });

    const body = await response.json().catch(() => ({}));
    if (!response.ok) return localPlan(inferred);

    try {
        const text = body.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return { provider: 'gemini', ...JSON.parse(text.replace(/```json|```/g, '').trim()) };
    } catch {
        return localPlan(inferred);
    }
}

export const recommendationsService = {
    list() {
        return recommendationsRepository.list();
    },

    createPlan(payload) {
        return geminiPlan(payload);
    }
};

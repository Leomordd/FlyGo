const API_URL = import.meta.env.VITE_API_URL || '/api';

export function getStoredSession() {
    try {
        return JSON.parse(localStorage.getItem('flygo-session') || 'null');
    } catch {
        return null;
    }
}

export function storeSession(session) {
    localStorage.setItem('flygo-session', JSON.stringify(session));
}

export function clearStoredSession() {
    localStorage.removeItem('flygo-session');
}

export async function apiRequest(path, options = {}) {
    const session = getStoredSession();
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (session?.token) {
        headers.Authorization = `Bearer ${session.token}`;
    }

    let response;

    try {
        response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined
        });
    } catch {
        throw new Error('No se pudo conectar con el backend. Abre una terminal en Backend y ejecuta npm.cmd run dev.');
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        throw new Error(data?.message || 'No se pudo completar la operacion');
    }

    return data;
}

export const api = {
    login: (payload) => apiRequest('/auth/login', { method: 'POST', body: payload }),
    register: (payload) => apiRequest('/auth/register', { method: 'POST', body: payload }),
    getCart: () => apiRequest('/cart'),
    saveCart: (items) => apiRequest('/cart', { method: 'PUT', body: { items } }),
    getPackages: () => apiRequest('/packages'),
    getPackage: (packageId) => apiRequest(`/packages/${packageId}`),
    createBooking: (payload) => apiRequest('/bookings', { method: 'POST', body: payload }),
    capturePaypalPayment: (orderId) => apiRequest('/payments/paypal/capture', { method: 'POST', body: { orderId } }),
    getReviews: (packageId) => apiRequest(`/reviews/package/${packageId}`),
    createReview: (payload) => apiRequest('/reviews', { method: 'POST', body: payload }),
    getComments: (packageId) => apiRequest(`/comments/package/${packageId}`),
    createComment: (payload) => apiRequest('/comments', { method: 'POST', body: payload })
};

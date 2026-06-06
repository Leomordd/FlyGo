import { createContext, useMemo, useState } from 'react';
import { api, clearStoredSession, getStoredSession, storeSession } from '../services/apiClient.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(() => getStoredSession());
    const [authError, setAuthError] = useState('');

    const value = useMemo(() => ({
        user: session?.user || null,
        token: session?.token || '',
        authError,
        login: async (credentials) => {
            setAuthError('');
            const nextSession = await api.login(credentials);
            storeSession(nextSession);
            setSession(nextSession);
            return nextSession;
        },
        register: async (payload) => {
            setAuthError('');
            const nextSession = await api.register(payload);
            storeSession(nextSession);
            setSession(nextSession);
            return nextSession;
        },
        logout: () => {
            clearStoredSession();
            setSession(null);
        },
        setAuthError
    }), [authError, session]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

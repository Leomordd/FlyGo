import { createContext, useMemo, useState } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const value = useMemo(() => ({
        user,
        login: (email) => setUser({ name: email.split('@')[0], email }),
        logout: () => setUser(null)
    }), [user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

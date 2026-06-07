import { createContext, useMemo, useState } from 'react';

const ARS_RATE = 1250;

export const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState(() => localStorage.getItem('flygo-currency') || 'USD');

    const value = useMemo(() => ({
        currency,
        setCurrency: (nextCurrency) => {
            localStorage.setItem('flygo-currency', nextCurrency);
            setCurrency(nextCurrency);
        },
        formatPrice: (amount) => {
            const usdAmount = Number(amount || 0);
            const displayAmount = currency === 'ARS' ? usdAmount * ARS_RATE : usdAmount;

            return new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency,
                maximumFractionDigits: 0
            }).format(displayAmount);
        },
        convertPrice: (amount) => currency === 'ARS' ? Number(amount || 0) * ARS_RATE : Number(amount || 0)
    }), [currency]);

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
}

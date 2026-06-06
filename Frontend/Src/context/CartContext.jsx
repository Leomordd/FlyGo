import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import { api } from '../services/apiClient.js';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [items, setItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('flygo-cart') || '[]');
        } catch {
            return [];
        }
    });
    const [cartError, setCartError] = useState('');
    const didHydrateRemoteCart = useRef(false);

    useEffect(() => {
        localStorage.setItem('flygo-cart', JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        didHydrateRemoteCart.current = false;

        if (!user) return;

        api.getCart()
            .then((cart) => {
                if (cart.items?.length) {
                    setItems(cart.items);
                } else if (items.length) {
                    return api.saveCart(items);
                }

                return null;
            })
            .then(() => {
                didHydrateRemoteCart.current = true;
            })
            .catch((error) => setCartError(error.message));
    }, [user?.id]);

    useEffect(() => {
        if (!user || !didHydrateRemoteCart.current) return;
        api.saveCart(items).catch((error) => setCartError(error.message));
    }, [items, user]);

    const value = useMemo(() => ({
        items,
        cartError,
        totalItems: items.reduce((total, item) => total + item.quantity, 0),
        totalPrice: items.reduce((total, item) => total + item.price * item.quantity, 0),
        addItem: (packageItem) => {
            setItems((currentItems) => {
                const existingItem = currentItems.find((item) => item.id === packageItem.id);

                if (existingItem) {
                    return currentItems.map((item) => (
                        item.id === packageItem.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ));
                }

                return [...currentItems, { ...packageItem, quantity: 1 }];
            });
        },
        removeItem: (id) => setItems((currentItems) => currentItems.filter((item) => item.id !== id)),
        clearCart: () => setItems([]),
        setItems
    }), [cartError, items]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

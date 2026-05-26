import { createContext, useMemo, useState } from 'react';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);

    const value = useMemo(() => ({
        items,
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
        clearCart: () => setItems([])
    }), [items]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

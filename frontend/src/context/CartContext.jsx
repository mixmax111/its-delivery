import React, { createContext, useState } from 'react';

// ✅ SAFE MODE: Funzioni vuote di default
export const CartContext = createContext({
    cart: [],
    addToCart: () => {},
    clearCart: () => {},
    isCartOpen: false,
    setIsCartOpen: () => {},
    total: 0
});

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
        setIsCartOpen(true);
    };

    const clearCart = () => setCart([]);

    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, clearCart, isCartOpen, setIsCartOpen, total }}>
            {children}
        </CartContext.Provider>
    );
};
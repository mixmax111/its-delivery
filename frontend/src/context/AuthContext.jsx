import React, { createContext, useState } from 'react';

// ✅ SAFE MODE: Valore di default vuoto
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('auth_token'));

    const login = (email, password) => {
        const encoded = btoa(`${email}:${password}`);
        localStorage.setItem('auth_token', encoded);
        setToken(encoded);
        window.location.reload();
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ token, isAuth: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
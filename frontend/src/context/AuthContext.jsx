import React, { createContext, useState } from 'react';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // Usiamo 'auth_token' per coerenza con il client.js che abbiamo sistemato prima
    const [token, setToken] = useState(localStorage.getItem('auth_token'));

    const login = async (email, password) => {
        try {
            // 1. Chiediamo al Backend il token VERO
            const response = await fetch('https://adanna-sja34-87786fd1c68b.herokuapp.com/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        mutation Login($email: String!, $password: String!) {
                            login(email: $email, password: $password) {
                                token
                                userId
                            }
                        }
                    `,
                    variables: { email, password }
                })
            });

            const result = await response.json();

            // 2. Controlliamo se ci sono errori
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            // 3. Prendiamo il token vero dalla risposta
            const realToken = result.data.login.token;

            // 4. Salviamo il token vero (non quello finto!)
            localStorage.setItem('auth_token', realToken);
            setToken(realToken);

            // Ricarichiamo per aggiornare l'interfaccia
            window.location.reload();

        } catch (error) {
            console.error("Login fallito:", error);
            alert("Errore login: " + error.message);
        }
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
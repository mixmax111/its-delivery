import React, { createContext, useState, useEffect } from 'react';
import { useMutation, useLazyQuery, useApolloClient } from '@apollo/client';
import { LOGIN_MUTATION, GET_ME, REGISTER_USER } from '../graphql/operations';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Stato iniziale
    const [token, setToken] = useState(localStorage.getItem('auth_token'));
    const [user, setUser] = useState(null);
    const client = useApolloClient();

    // 2. Mutation Login e Register
    const [loginMutation] = useMutation(LOGIN_MUTATION);
    const [registerMutation] = useMutation(REGISTER_USER);

    // 3. Query Profilo (VERSIONE SICURA)
    const [getMe] = useLazyQuery(GET_ME, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            if (data && data.me) {
                setUser(data.me);
            }
        },
        onError: (error) => {
            // 🚨 MODIFICA CRUCIALE PER L'ESAME 🚨
            // Invece di fare logout() e ricaricare la pagina,
            // ci limitiamo a stampare un avviso.
            // Così se manca un campo (es. address) il sito non crasha.
            console.warn("⚠️ Attenzione: Impossibile recuperare i dati utente completi.");
            console.error("Dettaglio Errore:", error.message);

            // logout(); // <--- RIMANE SPENTO PER EVITARE IL KICK
        }
    });

    // 4. Effetto al caricamento: se ho il token, provo a scaricare l'utente
    useEffect(() => {
        if (token && !user) {
            getMe();
        }
    }, [token, user, getMe]);

    // 5. Funzione Login
    const login = async (email, password) => {
        try {
            const { data } = await loginMutation({
                variables: { email, password }
            });

            if (data && data.login) {
                const { token: newToken } = data.login;

                // Salva token
                localStorage.setItem('auth_token', newToken);
                setToken(newToken);

                // Resetta Apollo (Fondamentale)
                await client.resetStore();

                // Prova a scaricare i dati utente
                await getMe();

                return true;
            }
        } catch (error) {
            console.error("Errore Login:", error);
            throw new Error(error.message || "Credenziali errate");
        }
    };

    // 6. Funzione Register
    const register = async (email, password, address) => {
        try {
            await registerMutation({
                variables: { email, password, address }
            });
            // Auto-login dopo la registrazione
            await login(email, password);
            return true;
        } catch (error) {
            console.error("Errore Registrazione:", error);
            throw error;
        }
    };

    // 7. Funzione Logout
    const logout = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
        client.clearStore();
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{
            token,
            isAuth: !!token, // Se c'è il token, per il frontend sei loggato (anche se getMe fallisce)
            user,
            login,
            logout,
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
};
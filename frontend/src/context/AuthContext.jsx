import React, { createContext, useState, useEffect } from 'react';
import { useMutation, useLazyQuery, useApolloClient } from '@apollo/client';
import { LOGIN_MUTATION, GET_ME, REGISTER_USER } from '../graphql/operations';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Inizializziamo lo stato leggendo il token dal disco
    const [token, setToken] = useState(localStorage.getItem('auth_token'));
    const [user, setUser] = useState(null);
    const client = useApolloClient();

    // --- HOOKS DI APOLLO ---
    // Mutation per il Login
    const [loginMutation] = useMutation(LOGIN_MUTATION);

    // Mutation per la Registrazione
    const [registerMutation] = useMutation(REGISTER_USER);

    // Query per scaricare il profilo (Lazy = la chiamiamo noi quando serve)
    const [getMe] = useLazyQuery(GET_ME, {
        fetchPolicy: 'network-only', // Non usare la cache, chiedi sempre al server
        onCompleted: (data) => {
            if (data && data.me) {
                setUser(data.me);
            }
        },
        onError: () => {
            // Se il token non è valido, facciamo logout forzato
            logout();
        }
    });

    // --- EFFETTO: AL CARICAMENTO PAGINA ---
    useEffect(() => {
        // Se c'è un token ma non abbiamo i dati dell'utente, scaricali
        if (token && !user) {
            getMe();
        }
    }, [token, user, getMe]);

    // --- FUNZIONE LOGIN ---
    const login = async (email, password) => {
        try {
            const { data } = await loginMutation({
                variables: { email, password }
            });

            if (data && data.login) {
                const { token: newToken } = data.login;

                // 1. Salva Token immediatamente
                localStorage.setItem('auth_token', newToken);
                setToken(newToken);

                // 2. Forza Apollo a resettare il database interno così legge il nuovo token
                await client.resetStore();

                // 3. Recupera i dati utente
                await getMe();

                return true;
            }
        } catch (error) {
            console.error("Errore Login:", error);
            // Se l'errore è "Not found" o simili, almeno sappiamo perché
            throw new Error(error.message || "Credenziali errate");
        }
    };

    // --- FUNZIONE REGISTRAZIONE ---
    const register = async (email, password, address) => {
        try {
            await registerMutation({
                variables: { email, password, address }
            });
            // Dopo la registrazione, facciamo subito il login automatico
            await login(email, password);
            return true;
        } catch (error) {
            console.error("Errore Registrazione:", error);
            throw error;
        }
    };

    // --- FUNZIONE LOGOUT ---
    const logout = () => {
        localStorage.removeItem('auth_token'); // Rimuovi il token
        setToken(null);
        setUser(null);
        client.clearStore(); // Svuota la cache di Apollo (prodotti, carrello, ecc.)
        window.location.href = '/'; // Ricarica pulita alla home
    };

    return (
        <AuthContext.Provider value={{
            token,
            isAuth: !!token, // True se il token esiste
            user,
            login,
            logout,
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
};
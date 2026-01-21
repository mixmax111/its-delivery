import React, { createContext, useState, useEffect } from 'react';
import { useMutation, useLazyQuery, useApolloClient } from '@apollo/client';
import { LOGIN_MUTATION, GET_ME, REGISTER_USER } from '../graphql/operations';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('auth_token'));
    const [user, setUser] = useState(null);
    const client = useApolloClient();

    const [loginMutation] = useMutation(LOGIN_MUTATION);
    const [registerMutation] = useMutation(REGISTER_USER);

    const [getMe] = useLazyQuery(GET_ME, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => { if (data && data.me) setUser(data.me); },
        onError: () => logout()
    });

    useEffect(() => {
        if (token && !user) getMe();
    }, [token, user, getMe]);

    const login = async (email, password) => {
        try {
            const { data } = await loginMutation({ variables: { email, password } });
            if (data && data.login) {
                const { token: newToken } = data.login;
                localStorage.setItem('auth_token', newToken);
                setToken(newToken);
                await client.resetStore(); // <--- CRUCIALE
                await getMe();
                return true;
            }
        } catch (error) {
            throw new Error(error.message || "Credenziali errate");
        }
    };

    const register = async (email, password, address) => {
        try {
            await registerMutation({ variables: { email, password, address } });
            await login(email, password);
            return true;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
        client.clearStore();
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ token, isAuth: !!token, user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
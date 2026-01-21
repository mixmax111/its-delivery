import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// ERRORE ERA QUI: Puntava a index.css invece di global.css
import './styles/global.css';

import { ApolloProvider } from '@apollo/client/react';
import client from './graphql/client';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <AuthProvider>
                <CartProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </CartProvider>
            </AuthProvider>
        </ApolloProvider>
    </React.StrictMode>,
);

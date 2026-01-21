import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_MENU } from '../graphql/operations';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const { loading, error, data } = useQuery(GET_MENU);

    if (loading) return (
        <div className="container" style={{ textAlign: 'center', marginTop: '50px', color: '#aaa' }}>
            <h2>Caricamento pizze in corso... 🍕</h2>
        </div>
    );

    if (error) return (
        <div className="container" style={{ textAlign: 'center', marginTop: '50px', color: '#E63946' }}>
            <h3>Errore di connessione al Backend 🔌</h3>
            <p>{error.message}</p>
            <small>Assicurati che il terminale del backend sia acceso su porta 4001</small>
        </div>
    );

    const products = data?.getMenu || [];

    return (
        <div className="container">
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '10px' }}>Il Nostro Menu</h1>
                <p style={{ color: '#aaa' }}>Scegli le pizze più buone della città, consegnate calde a casa tua.</p>
            </header>

            {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#1E1E1E', borderRadius: '12px' }}>
                    <h3>Il menu è vuoto 😢</h3>
                    <p>Admin, aggiungi qualche pizza dal database!</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '30px'
                }}>
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
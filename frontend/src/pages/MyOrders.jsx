import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_MY_ORDERS } from '../graphql/operations';
import { Package, Clock, CheckCircle } from 'lucide-react';

const MyOrders = () => {
    // 1. Chiediamo al Backend la lista degli ordini dell'utente loggato
    const { loading, error, data } = useQuery(GET_MY_ORDERS, {
        fetchPolicy: 'network-only' // Importante: ricarica sempre i dati freschi dal server
    });

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Caricamento ordini...</div>;

    if (error) return (
        <div className="container" style={{ textAlign: 'center', color: '#E63946', marginTop: '50px' }}>
            <h3>Errore nel caricamento ordini 😕</h3>
            <p>{error.message}</p>
        </div>
    );

    const orders = data?.getMyOrders || [];

    return (
        <div className="container">
            <h1 style={{ marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                I Miei Ordini 📦
            </h1>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#1E1E1E', borderRadius: '12px' }}>
                    <h3>Non hai ancora ordinato nulla.</h3>
                    <p style={{ color: '#aaa' }}>Torna al menu e ordina la tua prima pizza!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map((order) => (
                        <div key={order.id} style={{
                            backgroundColor: '#1E1E1E', padding: '20px', borderRadius: '12px',
                            border: '1px solid #333'
                        }}>
                            {/* Testata dell'ordine */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                                <div>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Ordine #{order.id}</span>
                                    <div style={{ fontSize: '0.9rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                                        <Clock size={14} /> {new Date(parseInt(order.created_at)).toLocaleDateString()}
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>
                                        € {order.total_amount.toFixed(2)}
                                    </div>
                                    <span style={{
                                        backgroundColor: order.status === 'PENDING' ? '#b8860b' : 'green',
                                        color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem'
                                    }}>
                    {order.status}
                  </span>
                                </div>
                            </div>

                            {/* Lista Prodotti nell'ordine */}
                            <div style={{ paddingLeft: '10px' }}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', color: '#ccc' }}>
                                        <CheckCircle size={14} color="var(--success)" />
                                        <span>{item.quantity}x <strong>{item.product.name}</strong></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
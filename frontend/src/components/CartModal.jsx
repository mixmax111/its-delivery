import React, { useContext } from 'react';
import { useMutation } from '@apollo/client'; // Importiamo Apollo
import { X, Loader } from 'lucide-react'; // Icone (Loader opzionale)

// Importiamo i Context e la Mutation
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CREATE_ORDER } from '../graphql/operations';

const CartModal = () => {
    const { cart, isCartOpen, setIsCartOpen, clearCart, total } = useContext(CartContext);
    const { isAuth } = useContext(AuthContext);

    // --- HOOK APOLLO PER L'ORDINE ---
    const [createOrder, { loading }] = useMutation(CREATE_ORDER, {
        // Se va tutto bene:
        onCompleted: (data) => {
            alert(`✅ Ordine #${data.createOrder.id} confermato con successo!`);
            clearCart();
            setIsCartOpen(false);
        },
        // Se c'è un errore (es. non sei loggato o token scaduto):
        onError: (err) => {
            console.error(err);
            alert("❌ Errore: " + err.message);

            // Se l'errore è "Not authenticated", potresti voler fare logout
            if (err.message.includes("authenticated")) {
                alert("Sessione scaduta. Fai di nuovo il login.");
            }
        }
    });

    const handleCheckout = () => {
        // 1. Controllo preliminare Login
        if (!isAuth) {
            alert("🔒 Devi effettuare il login per ordinare!");
            return;
        }

        // 2. Prepariamo i dati per il backend
        // Il server vuole due array separati: IDs e Quantità
        const productIds = cart.map(item => item.id);
        const quantities = cart.map(item => item.qty);

        // 3. Spariamo la mutation!
        createOrder({
            variables: {
                productIds: productIds,
                quantities: quantities
            }
        });
    };

    if (!isCartOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: '350px', backgroundColor: '#1E1E1E',
            borderLeft: '1px solid #333', padding: '20px', zIndex: 9999,
            display: 'flex', flexDirection: 'column'
        }}>
            {/* Tasto Chiudi */}
            <button onClick={() => setIsCartOpen(false)} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X />
            </button>

            <h2 style={{ color: 'white' }}>Il tuo Carrello</h2>

            <div style={{ marginTop: '20px', flex: 1, overflowY: 'auto' }}>
                {cart.length === 0 ? (
                    <p style={{ color: '#666', textAlign: 'center' }}>Il carrello è vuoto 😢</p>
                ) : (
                    cart.map((item, idx) => (
                        <div key={idx} style={{
                            marginBottom: '15px', paddingBottom: '15px',
                            borderBottom: '1px solid #333', color: '#ddd',
                            display: 'flex', justifyContent: 'space-between'
                        }}>
                            <div><span style={{ fontWeight: 'bold' }}>{item.qty}x</span> {item.name}</div>
                            <div>€ {(item.price * item.qty).toFixed(2)}</div>
                        </div>
                    ))
                )}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #444' }}>
                <h3 style={{ color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                    Totale: <span>€ {total.toFixed(2)}</span>
                </h3>

                <button
                    className="btn-primary"
                    style={{
                        width: '100%', marginTop: '20px',
                        padding: '15px', backgroundColor: loading ? '#555' : '#ff4757',
                        color: 'white', border: 'none', borderRadius: '8px',
                        fontSize: '1.1rem', fontWeight: 'bold', cursor: loading || cart.length === 0 ? 'not-allowed' : 'pointer',
                        opacity: loading || cart.length === 0 ? 0.5 : 1,
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
                    }}
                    onClick={handleCheckout}
                    disabled={loading || cart.length === 0}
                >
                    {loading ? (
                        <>Attendere... <Loader className="spin" size={20}/></>
                    ) : (
                        "CONFERMA ORDINE 🚀"
                    )}
                </button>
            </div>
        </div>
    );
};

export default CartModal;
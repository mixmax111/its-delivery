import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useMutation } from '@apollo/client'; // ✅ IMPORT CRITICO
import { CREATE_ORDER } from '../graphql/operations';
import { X } from 'lucide-react';

const CartModal = () => {
    const { cart, isCartOpen, setIsCartOpen, clearCart, total } = useContext(CartContext);
    const { isAuth } = useContext(AuthContext);

    const [createOrder] = useMutation(CREATE_ORDER, {
        onCompleted: (data) => {
            alert(`Ordine #${data.createOrder.id} completato!`);
            clearCart();
            setIsCartOpen(false);
        },
        onError: (err) => alert("Errore: " + err.message)
    });

    const handleCheckout = () => {
        if (!isAuth) return alert("Devi fare login!");
        const productIds = cart.map(p => p.id);
        const quantities = cart.map(p => p.qty);
        createOrder({ variables: { productIds, quantities } });
    };

    if (!isCartOpen) return null;

    return (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '350px', backgroundColor: '#1E1E1E', borderLeft: '1px solid #333', padding: '20px', zIndex: 999 }}>
            <button onClick={() => setIsCartOpen(false)} style={{ float: 'right', background: 'none', color: 'white' }}><X /></button>
            <h2>Carrello</h2>
            <div style={{ marginTop: '20px' }}>
                {cart.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '10px' }}>{item.name} x {item.qty} - € {item.price * item.qty}</div>
                ))}
            </div>
            <h3>Totale: € {total.toFixed(2)}</h3>
            <button className="btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={handleCheckout} disabled={cart.length === 0}>Ordina</button>
        </div>
    );
};
export default CartModal;
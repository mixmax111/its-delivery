import React, { useContext, useState } from 'react';
import { ShoppingBag, User } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import AuthModal from './AuthModal';
import CartModal from './CartModal';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { cart, setIsCartOpen } = useContext(CartContext);
    const { isAuth, logout } = useContext(AuthContext);
    const [showAuth, setShowAuth] = useState(false);

    return (
        <>
            <nav style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#121212' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#E63946', fontWeight: 'bold', fontSize: '1.5rem' }}>ITSDelivery 🍕</Link>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    {isAuth ? (
                        <button onClick={() => logout && logout()} style={{ color: 'white', background: 'transparent', border: '1px solid gray', padding: '5px' }}>Logout</button>
                    ) : (
                        <button onClick={() => setShowAuth(true)} style={{ color: 'white', background: 'transparent', display: 'flex', gap: '5px' }}><User /> Accedi</button>
                    )}
                    <button onClick={() => setIsCartOpen(true)} style={{ color: 'white', background: 'transparent' }}>
                        <ShoppingBag /> {cart.length > 0 && <span>({cart.length})</span>}
                    </button>
                </div>
            </nav>
            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
            <CartModal />
        </>
    );
};
export default Navbar;
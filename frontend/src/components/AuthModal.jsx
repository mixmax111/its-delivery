import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X } from 'lucide-react';

const AuthModal = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true); // Switch tra Login e Registrazione
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const { login, register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login(email, password);
                alert("Bentornato!");
            } else {
                await register(email, password, address);
                alert("Registrazione completata!");
            }
            onClose(); // Chiude il modale dopo il successo
        } catch (err) {
            alert("Errore: " + err.message);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
            <div style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '15px', width: '350px', position: 'relative', color: 'white' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', color: 'gray', border: 'none', cursor: 'pointer' }}><X /></button>

                <h2>{isLogin ? 'Accedi' : 'Registrati'}</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <input
                        type="email" placeholder="Email" required
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#333', color: 'white' }}
                    />
                    <input
                        type="password" placeholder="Password" required
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#333', color: 'white' }}
                    />

                    {!isLogin && (
                        <input
                            type="text" placeholder="Indirizzo"
                            value={address} onChange={(e) => setAddress(e.target.value)}
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#333', color: 'white' }}
                        />
                    )}

                    <button type="submit" style={{ padding: '12px', backgroundColor: '#E63946', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                        {isLogin ? 'ENTRA' : 'CREA ACCOUNT'}
                    </button>
                </form>

                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#aaa' }}>
                    {isLogin ? "Non hai un account?" : "Hai già un account?"}
                    <span
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ color: '#E63946', marginLeft: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {isLogin ? 'Registrati' : 'Accedi'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
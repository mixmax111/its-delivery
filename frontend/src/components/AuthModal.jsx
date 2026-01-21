import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../graphql/operations';
import { X } from 'lucide-react';

const AuthModal = ({ onClose }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { login } = useContext(AuthContext);

    // Stati del form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [localError, setLocalError] = useState('');

    // Mutation GraphQL
    const [registerUser, { loading }] = useMutation(REGISTER_USER, {
        onCompleted: (data) => {
            alert(`✅ Registrazione OK! Utente ID: ${data.registerUser.id}\nOra verrai reindirizzato al login.`);
            setIsLoginMode(true); // Cambia schermata
            setLocalError('');
        },
        onError: (error) => {
            console.error("Errore Mutation:", error);
            setLocalError(error.message); // Mostra errore rosso nel form
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault(); // BLOCCA IL RICARICAMENTO DELLA PAGINA
        setLocalError(''); // Resetta errori vecchi

        console.log("👉 Click rilevato! Modalità:", isLoginMode ? "Login" : "Registrazione");

        // Validazione base
        if (!email || !password) {
            setLocalError("Inserisci email e password!");
            return;
        }

        try {
            if (isLoginMode) {
                // Logica LOGIN
                await login(email, password);
                onClose(); // Chiudi modale se login ok
            } else {
                // Logica REGISTRAZIONE
                if (!address) {
                    setLocalError("L'indirizzo è obbligatorio per registrarsi!");
                    return;
                }
                console.log("Invio dati registrazione...", { email, password, address });

                // Eseguiamo la mutation
                await registerUser({ variables: { email, password, address } });
            }
        } catch (err) {
            console.error("Errore CATCH:", err);
            setLocalError("Errore imprevisto: " + err.message);
        }
    };

    // Stili
    const overlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
    };

    const modalStyle = {
        backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', width: '400px', position: 'relative',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)'
    };

    const inputStyle = {
        width: '100%', padding: '12px', margin: '8px 0',
        backgroundColor: '#333', border: '1px solid #444', color: 'white', borderRadius: '6px', fontSize: '16px'
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <button onClick={onClose} style={{ position: 'absolute', top: 15, right: 15, background: 'none', color: 'white', cursor: 'pointer' }}>
                    <X size={24} />
                </button>

                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary)' }}>
                    {isLoginMode ? 'Accedi' : 'Crea Account'}
                </h2>

                {localError && (
                    <div style={{ backgroundColor: '#ff444433', border: '1px solid #ff4444', color: '#ff8888', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>
                        ⚠️ {localError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email" placeholder="Email" autoFocus
                        value={email} onChange={e => setEmail(e.target.value)}
                        style={inputStyle}
                    />
                    <input
                        type="password" placeholder="Password"
                        value={password} onChange={e => setPassword(e.target.value)}
                        style={inputStyle}
                    />

                    {!isLoginMode && (
                        <input
                            type="text" placeholder="Indirizzo (Via, Città)"
                            value={address} onChange={e => setAddress(e.target.value)}
                            style={inputStyle}
                        />
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '20px', padding: '12px', fontSize: '16px', opacity: loading ? 0.7 : 1 }}
                        disabled={loading}
                    >
                        {loading ? 'Caricamento...' : (isLoginMode ? 'Entra' : 'Registrati Ora')}
                    </button>
                </form>

                <p style={{ marginTop: '20px', textAlign: 'center', color: '#aaa', cursor: 'pointer', fontSize: '14px' }} onClick={() => { setIsLoginMode(!isLoginMode); setLocalError(''); }}>
                    {isLoginMode ? 'Non hai un account? Clicca qui' : 'Hai già un account? Accedi'}
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
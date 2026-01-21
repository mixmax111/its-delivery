import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Plus, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);

    return (
        <div style={{
            backgroundColor: '#1E1E1E',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'transform 0.2s',
            height: '100%'
        }}>
            {/* Immagine (Se c'è l'URL bene, altrimenti rettangolo grigio) */}
            <div style={{
                height: '180px',
                backgroundColor: '#333',
                backgroundImage: product.image_url ? `url(${product.image_url})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {!product.image_url && <span style={{color: '#555'}}>No Image</span>}
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{product.name}</h3>
                    <span style={{
                        backgroundColor: '#333', padding: '4px 8px', borderRadius: '6px',
                        fontSize: '0.8rem', color: '#aaa'
                    }}>
                {product.category}
            </span>
                </div>

                <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px', flex: 1, lineHeight: '1.4' }}>
                    {product.description || "Nessuna descrizione disponibile."}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.3rem', color: 'white' }}>
            € {parseFloat(product.price).toFixed(2)}
          </span>

                    <button
                        className="btn-primary"
                        onClick={() => addToCart(product)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 16px', cursor: 'pointer'
                        }}
                    >
                        <Plus size={18} /> Aggiungi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
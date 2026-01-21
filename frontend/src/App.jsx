import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyOrders from './pages/MyOrders'; // ✅ Importato

function App() {
    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '20px', paddingBottom: '50px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/orders" element={<MyOrders />} /> {/* ✅ Rotta Attiva */}
                </Routes>
            </div>
        </>
    );
}

export default App;
// File: backend/seed_products.js
const db = require('./config/db');

const products = [
    {
        name: "Margherita DOP",
        description: "Pomodoro San Marzano, Mozzarella di Bufala, Basilico fresco, Olio EVO.",
        price: 8.50,
        category: "Pizze",
        image_url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80"
    },
    {
        name: "Diavola Piccante",
        description: "Pomodoro, Mozzarella, Salame piccante Napoli, Peperoncino fresco.",
        price: 9.50,
        category: "Pizze",
        image_url: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80"
    },
    {
        name: "Vegetariana",
        description: "Mozzarella fior di latte, Zucchine, Melanzane grigliate, Peperoni.",
        price: 10.00,
        category: "Pizze",
        image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80"
    },
    {
        name: "Coca Cola Zero",
        description: "Lattina 33cl fresca.",
        price: 2.50,
        category: "Bibite",
        image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80"
    }
];

async function seed() {
    console.log("🌱 Inizio inserimento prodotti...");

    try {
        for (const p of products) {
            await db.query(
                "INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)",
                [p.name, p.description, p.price, p.category, p.image_url]
            );
            console.log(`✅ Aggiunta: ${p.name}`);
        }
        console.log("🚀 Menu riempito con successo!");
    } catch (error) {
        console.error("❌ Errore:", error.message);
    } finally {
        process.exit();
    }
}

seed();
// File: backend/setup_tables.js
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTables() {
    console.log("⏳ Tentativo di connessione al database...");

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    console.log("✅ Connesso! Creazione tabelle in corso...");

    try {
        // 1. Tabella USERS
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('ADMIN', 'CUSTOMER') DEFAULT 'CUSTOMER',
                address VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL
            );
        `);
        console.log(" - Tabella 'users' OK");

        // 2. Tabella PRODUCTS
        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                image_url VARCHAR(500),
                category VARCHAR(50) NOT NULL,
                is_available BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL
            );
        `);
        console.log(" - Tabella 'products' OK");

        // 3. Tabella ORDERS
        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                total_amount DECIMAL(10, 2) NOT NULL,
                status ENUM('PENDING', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);
        console.log(" - Tabella 'orders' OK");

        // 4. Tabella ORDER_ITEMS
        await connection.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                price_at_order DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            );
        `);
        console.log(" - Tabella 'order_items' OK");

        console.log("🚀 TUTTE LE TABELLE SONO STATE CREATE CORRETTAMENTE!");

    } catch (error) {
        console.error("❌ Errore durante la creazione:", error);
    } finally {
        await connection.end();
        process.exit();
    }
}

createTables();

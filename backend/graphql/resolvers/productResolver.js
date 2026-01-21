const db = require('../../config/db');

module.exports = {
    // Queries
    getMenu: async () => {
        const [rows] = await db.query("SELECT * FROM products WHERE deleted_at IS NULL");
        return rows;
    },

    // Mutations (Solo Admin)
    addProduct: async ({ name, description, price, category, image_url }, context) => {
        if (!context.isAuth || context.user.role !== 'ADMIN') {
            throw new Error("Accesso negato: Solo ADMIN");
        }

        const [res] = await db.query(
            "INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)",
            [name, description, price, category, image_url]
        );

        return { id: res.insertId, name, price, category, is_available: true };
    },

    deleteProduct: async ({ id }, context) => {
        if (!context.isAuth || context.user.role !== 'ADMIN') throw new Error("Solo ADMIN");

        await db.query("UPDATE products SET deleted_at = NOW() WHERE id = ?", [id]);
        return "Prodotto eliminato correttamente";
    }
};
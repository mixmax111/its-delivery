const db = require('../../config/db');

module.exports = {
    // Queries
    getMyOrders: async (args, context) => {
        if (!context.isAuth) throw new Error("Devi fare login");

        // Prendiamo gli ordini
        const [orders] = await db.query(
            "SELECT * FROM orders WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC",
            [context.user.id]
        );

        // Per ogni ordine, dobbiamo trovare i prodotti (Popolamento manuale)
        for (let order of orders) {
            const [items] = await db.query(`
                SELECT oi.quantity, p.* FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            `, [order.id]);

            // Mappiamo nel formato corretto per GraphQL
            order.items = items.map(item => ({
                quantity: item.quantity,
                product: item
            }));
        }

        return orders;
    },

    // Mutations
    createOrder: async ({ productIds, quantities }, context) => {
        if (!context.isAuth) throw new Error("Devi fare login");

        // Nota: productIds e quantities devono essere array della stessa lunghezza
        // Logica semplificata per l'esame

        let total = 0;
        // 1. Calcolo totale (Query veloce) - Qui si potrebbe ottimizzare
        for (let i = 0; i < productIds.length; i++) {
            const [p] = await db.query("SELECT price FROM products WHERE id = ?", [productIds[i]]);
            if(p.length > 0) total += p[0].price * quantities[i];
        }

        // 2. Creo Ordine
        const [orderRes] = await db.query(
            "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, 'PENDING')",
            [context.user.id, total]
        );
        const orderId = orderRes.insertId;

        // 3. Creo Dettagli (Items)
        for (let i = 0; i < productIds.length; i++) {
            const [p] = await db.query("SELECT price FROM products WHERE id = ?", [productIds[i]]);
            await db.query(
                "INSERT INTO order_items (order_id, product_id, quantity, price_at_order) VALUES (?, ?, ?, ?)",
                [orderId, productIds[i], quantities[i], p[0].price]
            );
        }

        return { id: orderId, total_amount: total, status: 'PENDING' };
    }
};
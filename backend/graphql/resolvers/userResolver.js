const db = require('../../config/db');
const { hashPassword } = require('../../utils/security');

module.exports = {
    // Queries
    me: async (args, context) => {
        if (!context.isAuth) throw new Error("Non autenticato");
        return context.user;
    },

    // Mutations
    registerUser: async ({ email, password, address }) => {
        // Controllo duplicati
        const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existing.length > 0) throw new Error("Email già in uso");

        const hashedPassword = await hashPassword(password);

        const [res] = await db.query(
            "INSERT INTO users (email, password, address) VALUES (?, ?, ?)",
            [email, hashedPassword, address]
        );

        return { id: res.insertId, email, address, role: 'CUSTOMER' };
    }
};
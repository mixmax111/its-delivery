const db = require('../config/db');
const { comparePassword } = require('../utils/security');

const authMiddleware = async (req, res, next) => {
    // 1. Cerchiamo l'header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        req.isAuth = false;
        return next();
    }

    // 2. Decodifichiamo "Basic base64string"
    const encoded = authHeader.split(' ')[1];
    if (!encoded) {
        req.isAuth = false;
        return next();
    }

    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');

    // 3. Verifichiamo nel Database
    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ? AND deleted_at IS NULL", [email]);
        const user = users[0];

        if (user && await comparePassword(password, user.password)) {
            req.isAuth = true;
            req.user = user; // Salviamo l'utente nella richiesta
        } else {
            req.isAuth = false;
        }
    } catch (error) {
        req.isAuth = false;
    }

    next();
};

module.exports = authMiddleware;
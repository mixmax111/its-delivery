const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config();

const db = require('./config/db');
const schema = require('./graphql/index');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Registriamo il middleware di Auth SU TUTTE le richieste
// Questo popola req.user e req.isAuth
app.use(authMiddleware);

app.use('/graphql', graphqlHTTP((req) => ({
    schema: schema,
    graphiql: true,
    context: {
        // Passiamo i dati dell'utente ai resolver
        user: req.user,
        isAuth: req.isAuth
    }
})));

// Test DB
(async () => {
    try {
        await db.query("SELECT 1");
        console.log("✅ Database JawsDB connesso!");
    } catch (error) {
        console.error("❌ Errore Database:", error.message);
    }
})();

app.listen(PORT, () => {
    console.log(`🚀 Server ITS Delivery attivo su http://localhost:${PORT}/graphql`);
});
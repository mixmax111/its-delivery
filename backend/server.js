const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config();

const db = require('./config/db');
const schema = require('./graphql/index');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4000;

// --- CONFIGURAZIONE CORS AGGIORNATA ---
// Permette a Vercel di comunicare senza blocchi
const corsOptions = {
    origin: '*', // Accetta richieste da qualsiasi sito (perfetto per l'esame)
    credentials: true, // Permette l'invio di cookie/header autorizzativi
    methods: ['GET', 'POST', 'OPTIONS'], // Metodi permessi
    allowedHeaders: ['Content-Type', 'Authorization'] // Header permessi
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Risponde subito OK alle richieste di controllo (Preflight)
// --------------------------------------

app.use(express.json());

// Middleware di Auth
app.use(authMiddleware);

app.use('/graphql', graphqlHTTP((req) => ({
    schema: schema,
    graphiql: true,
    context: {
        user: req.user,
        isAuth: req.isAuth
    }
})));

// Test DB 2
(async () => {
    try {
        await db.query("SELECT 1");
        console.log("Database connesso");
    } catch (error) {
        console.error("Errore Database:", error.message);
    }
})();

app.listen(PORT, () => {
    console.log(`🚀 Server ITS Delivery attivo su porta ${PORT}`);
});
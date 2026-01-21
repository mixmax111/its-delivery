const express = require('express');
const cors = require('cors'); // Assicurati di avere 'cors' installato
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config();

const db = require('./config/db');
const schema = require('./graphql/index');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4000;

// --- ZONA CORS SICURA ---
// 1. Abilitiamo CORS per TUTTI (*)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Rispondiamo esplicitamente OK alle richieste di controllo (Preflight)
app.options('*', cors());
// -----------------------

app.use(express.json());

// Middleware Auth (SOLO DOPO aver gestito il CORS)
app.use(authMiddleware);

// Rotta di benvenuto (utile per testare se il server è vivo)
app.get('/', (req, res) => {
    res.send("🚀 Backend ITS Delivery Funzionante!");
});

app.use('/graphql', graphqlHTTP((req) => ({
    schema: schema,
    graphiql: true,
    context: { user: req.user, isAuth: req.isAuth }
})));

// Test Connessione DB
(async () => {
    try {
        await db.query("SELECT 1");
        console.log("✅ Database JawsDB connesso!");
    } catch (error) {
        console.error("❌ Errore Database:", error.message);
    }
})();

app.listen(PORT, () => {
    console.log(`🚀 Server attivo su porta ${PORT}`);
});
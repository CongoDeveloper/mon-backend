const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => console.log("✅ MongoDB Connecté"));

// Tes Modèles (School, Student) ici...
// [Garde ton code habituel pour les API /api/login, /api/schools, etc.]

// --- AJOUTE CES LIGNES POUR MONTRER LE SITE SUR LE LIEN ---
app.use(express.static(path.join(__dirname, '/')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur prêt`));

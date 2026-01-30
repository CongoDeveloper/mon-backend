const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Récupération du lien depuis Render
const mongoURI = process.env.MONGODB_URI;

// Connexion à MongoDB sans faire planter le serveur
if (mongoURI) {
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("✅ MongoDB Connecté avec succès"))
        .catch(err => console.log("❌ Erreur de connexion MongoDB : ", err.message));
} else {
    console.log("⚠️ Attention : MONGODB_URI est introuvable dans les variables Render.");
}

// Modèles
const School = mongoose.model('School', new mongoose.Schema({
    name: String, img: String, staffUser: String, staffPass: String, communique: { type: String, default: "" }
}));

const Student = mongoose.model('Student', new mongoose.Schema({
    schoolId: String, name: String, id: String, parentId: String, className: String,
    presence: { type: String, default: "Présent" }, conduite: { type: String, default: "Bonne" },
    isConvoked: { type: Boolean, default: false },
    points: { p1: Number, p2: Number, p3: Number, p4: Number },
    history: { type: Map, of: String, default: {} }
}));

// Routes
app.get('/', (req, res) => res.send("🚀 Serveur en ligne et prêt !"));

app.post('/api/login', async (req, res) => {
    const { user, pass } = req.body;
    // Ton mot de passe admin spécifique
    if (user === 'admin' && pass === ', wilson eliotta mwenda 2003') {
        return res.json({ role: 'ADMIN', name: 'Super Admin' });
    }
    const school = await School.findOne({ staffUser: user, staffPass: pass });
    if (school) res.json({ role: 'STAFF', schoolId: school._id, name: school.name });
    else res.status(401).json({ error: "Identifiants incorrects" });
});

app.get('/api/schools', async (req, res) => res.json(await School.find()));
app.post('/api/schools', async (req, res) => {
    const s = new School(req.body); await s.save(); res.json(s);
});
app.get('/api/students', async (req, res) => res.json(await Student.find()));
app.post('/api/students', async (req, res) => {
    const s = new Student(req.body); await s.save(); res.json(s);
});
app.put('/api/students/:id', async (req, res) => {
    const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(s);
});
app.delete('/api/students/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id); res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Ajouté pour gérer les chemins de fichiers
const app = express();

app.use(express.json());
app.use(cors());

// --- CONNEXION MONGO ---
const MONGO_URI = "mongodb+srv://ecole:0987654321@cluster0.0r2sdrr.mongodb.net/gestion_scolaire?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connecté à MongoDB"))
    .catch(err => console.error("❌ Erreur MongoDB:", err));

// --- MODÈLES ---
const School = mongoose.model('School', new mongoose.Schema({
    name: String,
    img: String,
    staffUser: String,
    staffPass: String,
    communique: { type: String, default: "" }
}));

const Student = mongoose.model('Student', new mongoose.Schema({
    schoolId: String, 
    name: String,
    id: String,
    parentId: String,
    className: String,
    presence: { type: String, default: "Présent" },
    conduite: { type: String, default: "Bonne" },
    isConvoked: { type: Boolean, default: false },
    message: { type: String, default: "" },
    points: {
        p1: { type: Number, default: 0 }, 
        p2: { type: Number, default: 0 }, 
        ex1: { type: Number, default: 0 },
        p3: { type: Number, default: 0 }, 
        p4: { type: Number, default: 0 }, 
        ex2: { type: Number, default: 0 }
    },
    history: { type: Object, default: {} }
}));

// --- CONFIGURATION POUR AFFICHER LE SITE ---
// Cette ligne dit au serveur d'utiliser les fichiers présents dans le dossier actuel
app.use(express.static(__dirname));

// CETTE ROUTE AFFICHE MAINTENANT VOTRE SITE index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- ROUTES API (NE CHANGE PAS) ---

app.post('/api/login', async (req, res) => {
    const { user, pass } = req.body;
    if(user === 'admin' && pass === ', wilson eliotta mwenda 2003') {
        return res.json({ role: 'ADMIN', name: 'Super Admin' });
    }
    const school = await School.findOne({ staffUser: user, staffPass: pass });
    if(school) {
        res.json({ role: 'STAFF', schoolId: school._id, name: school.name });
    } else {
        res.status(401).json({ message: "Identifiants incorrects" });
    }
});

app.get('/api/schools', async (req, res) => {
    res.json(await School.find());
});

app.post('/api/schools', async (req, res) => {
    const school = new School(req.body);
    await school.save();
    res.json(school);
});

app.put('/api/schools/:id', async (req, res) => {
    await School.findByIdAndUpdate(req.params.id, req.body);
    res.sendStatus(200);
});

app.delete('/api/schools/:id', async (req, res) => {
    await School.findByIdAndDelete(req.params.id);
    await Student.deleteMany({ schoolId: req.params.id });
    res.sendStatus(200);
});

app.get('/api/students', async (req, res) => {
    res.json(await Student.find());
});

app.post('/api/students', async (req, res) => {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
});

app.put('/api/students/:id', async (req, res) => {
    await Student.findByIdAndUpdate(req.params.id, req.body);
    res.sendStatus(200);
});

app.delete('/api/students/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Serveur actif sur le port ${PORT}`));

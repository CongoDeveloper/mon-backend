const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Définition des Modèles directement pour plus de simplicité
const SchoolSchema = new mongoose.Schema({
    name: String,
    img: String,
    staffUser: String,
    staffPass: String,
    communique: { type: String, default: "" }
});

const StudentSchema = new mongoose.Schema({
    schoolId: String,
    name: String,
    id: String,
    parentId: String,
    className: String,
    presence: { type: String, default: "Présent" },
    conduite: { type: String, default: "Bonne" },
    isConvoked: { type: Boolean, default: false },
    points: {
        p1: { type: Number, default: 0 },
        p2: { type: Number, default: 0 },
        p3: { type: Number, default: 0 },
        p4: { type: Number, default: 0 }
    },
    history: { type: Map, of: String, default: {} }
});

const School = mongoose.model('School', SchoolSchema);
const Student = mongoose.model('Student', StudentSchema);

const app = express();
app.use(express.json());
app.use(cors());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB Connecté"))
    .catch(err => console.error("❌ Erreur de connexion", err));

// --- AJOUT DE CETTE ROUTE POUR ÉVITER "CANNOT GET /" ---
app.get('/', (req, res) => {
    res.send("🚀 Serveur de Gestion Scolaire en ligne !");
});

// --- ROUTES ÉCOLES ---
app.get('/api/schools', async (req, res) => {
    const schools = await School.find();
    res.json(schools);
});

app.post('/api/schools', async (req, res) => {
    const newSchool = new School(req.body);
    await newSchool.save();
    res.json(newSchool);
});

app.put('/api/schools/:id/communique', async (req, res) => {
    await School.findByIdAndUpdate(req.params.id, { communique: req.body.communique });
    res.json({ success: true });
});

// --- ROUTES ÉLÈVES ---
app.get('/api/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.post('/api/students', async (req, res) => {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
});

app.put('/api/students/:id', async (req, res) => {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
});

app.delete('/api/students/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Supprimé" });
});

app.delete('/api/schools/:id', async (req, res) => {
    await School.findByIdAndDelete(req.params.id);
    await Student.deleteMany({ schoolId: req.params.id });
    res.json({ message: "École supprimée" });
});

// --- LOGIN ---
app.post('/api/login', async (req, res) => {
    const { user, pass } = req.body;
    
    // Ton mot de passe admin spécifique
    if (user === 'admin' && pass === ', wilson eliotta mwenda 2003') {
        return res.json({ role: 'ADMIN', name: 'Super Admin' });
    }

    const school = await School.findOne({ staffUser: user, staffPass: pass });
    if (school) {
        res.json({ role: 'STAFF', schoolId: school._id, name: school.name });
    } else {
        res.status(401).json({ error: "Identifiants incorrects" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));

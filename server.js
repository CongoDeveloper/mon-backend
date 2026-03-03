const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Votre lien MongoDB avec le mot de passe intégré
const MONGO_URI = "mongodb+srv://ecole:0987654321@cluster0.0r2sdrr.mongodb.net/gestion_scolaire?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connecté à MongoDB avec succès !"))
    .catch(err => console.error("❌ Erreur de connexion MongoDB:", err));

// --- MODÈLES DE DONNÉES ---

const SchoolSchema = new mongoose.Schema({
    name: String,
    img: String,
    staffUser: String,
    staffPass: String,
    communique: String
});
const School = mongoose.model('School', SchoolSchema);

const StudentSchema = new mongoose.Schema({
    schoolId: String,
    name: String,
    id: String,
    parentId: String,
    className: String,
    presence: String,
    conduite: String,
    isConvoked: Boolean,
    message: String,
    points: {
        p1: Number, p2: Number, ex1: Number,
        p3: Number, p4: Number, ex2: Number
    },
    history: Object
});
const Student = mongoose.model('Student', StudentSchema);

// --- ROUTES API ---

// Login pour le personnel
app.post('/api/login', async (req, res) => {
    const { user, pass } = req.body;
    // Vérification Super Admin
    if(user === 'admin' && pass === ', wilson eliotta mwenda 2003') {
        return res.json({ role: 'ADMIN', name: 'Super Admin' });
    }
    // Vérification Staff École
    const school = await School.findOne({ staffUser: user, staffPass: pass });
    if(school) {
        res.json({ role: 'STAFF', schoolId: school._id, name: school.name });
    } else {
        res.status(401).json({ message: "Identifiants incorrects" });
    }
});

// Gestion des Écoles
app.get('/api/schools', async (req, res) => {
    const schools = await School.find();
    res.json(schools);
});

app.post('/api/schools', async (req, res) => {
    const newSchool = new School(req.body);
    await newSchool.save();
    res.json(newSchool);
});

// Gestion des Élèves
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
    await Student.findByIdAndUpdate(req.params.id, req.body);
    res.sendStatus(200);
});

app.delete('/api/students/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
});

// Lancement du serveur
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Serveur actif sur le port ${PORT}`));

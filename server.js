const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { School, Student } = require('./models');

const app = express();
app.use(express.json());
app.use(cors());

// Connexion MongoDB (Utilise ta variable d'environnement sur Render)
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connecté à MongoDB"))
    .catch(err => console.error("Erreur de connexion", err));

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
    const school = await School.findByIdAndUpdate(req.params.id, { communique: req.body.communique }, { new: true });
    res.json(school);
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

// --- LOGIN (ADMIN & STAFF) ---
app.post('/api/login', async (req, res) => {
    const { user, pass } = req.body;
    
    // Login Admin avec ton mot de passe spécifique
    if (user === 'admin' && pass === ', wilson eliotta mwenda 2003') {
        return res.json({ role: 'ADMIN', name: 'Super Admin' });
    }

    // Login Staff
    const school = await School.findOne({ staffUser: user, staffPass: pass });
    if (school) {
        res.json({ role: 'STAFF', schoolId: school._id, name: school.name });
    } else {
        res.status(401).json({ error: "Identifiants incorrects" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));

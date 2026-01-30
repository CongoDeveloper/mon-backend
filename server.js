const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// --- CONNEXION MONGODB ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB Connecté"))
    .catch(err => console.log("❌ Erreur MongoDB : ", err.message));

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
    points: {
        p1: { type: Number, default: 0 },
        p2: { type: Number, default: 0 },
        p3: { type: Number, default: 0 },
        p4: { type: Number, default: 0 }
    },
    history: { type: Map, of: String, default: {} }
}));

// --- ROUTES API ---

// LOGIN (C'est ici que ton mot de passe est géré)
app.post('/api/login', async (req, res) => {
    const { user, pass } = req.body;
    
    // VERIFICATION ADMIN
    if (user === 'admin' && pass === ', wilson eliotta mwenda 2003') {
        return res.json({ role: 'ADMIN', name: 'Super Admin' });
    }

    // VERIFICATION STAFF (ÉCOLES)
    const school = await School.findOne({ staffUser: user, staffPass: pass });
    if (school) {
        res.json({ role: 'STAFF', schoolId: school._id, name: school.name });
    } else {
        res.status(401).json({ error: "Identifiants incorrects" });
    }
});

// ÉCOLES
app.get('/api/schools', async (req, res) => res.json(await School.find()));
app.post('/api/schools', async (req, res) => {
    const s = new School(req.body); await s.save(); res.json(s);
});
app.put('/api/schools/:id/communique', async (req, res) => {
    await School.findByIdAndUpdate(req.params.id, { communique: req.body.communique });
    res.json({ success: true });
});
app.delete('/api/schools/:id', async (req, res) => {
    await School.findByIdAndDelete(req.params.id);
    await Student.deleteMany({ schoolId: req.params.id });
    res.json({ success: true });
});

// ÉLÈVES
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

// --- SERVIR LE SITE (INDEX.HTML) ---
app.use(express.static(path.join(__dirname, '/')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur prêt sur port ${PORT}`));

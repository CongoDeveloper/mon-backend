const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Connexion à MongoDB (Remplacez avec VOTRE lien de l'étape 1)
mongoose.connect('VOTRE_LIEN_MONGODB_ICI', { useNewUrlParser: true, useUnifiedTopology: true });

// Modèle pour les Écoles
const School = mongoose.model('School', {
    id: String, name: String, img: String, staffUser: String, staffPass: String, communique: String
});

// Modèle pour les Élèves
const Student = mongoose.model('Student', {
    schoolId: String, name: String, idStudent: String, parentId: String, 
    className: String, presence: String, conduite: String, isConvoked: Boolean,
    points: Object, history: Object
});

// Routes API
app.get('/api/schools', async (req, res) => res.json(await School.find()));
app.post('/api/schools', async (req, res) => {
    const school = new School(req.body);
    await school.save();
    res.json(school);
});

app.get('/api/students', async (req, res) => res.json(await Student.find()));
app.post('/api/students', async (req, res) => {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
});

// Port du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));

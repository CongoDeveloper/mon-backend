const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Connexion à MongoDB (Remplacez l'URL par la vôtre sur MongoDB Atlas)
const MONGO_URI = "VOTRE_URL_MONGODB_ICI"; 
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connecté à MongoDB"))
    .catch(err => console.log(err));

// --- MODÈLES ---

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

// --- ROUTES ---

// Récupérer toutes les écoles
app.get('/api/schools', async (req, res) => {
    const schools = await School.find();
    res.json(schools);
});

// Ajouter une école
app.post('/api/schools', async (req, res) => {
    const newSchool = new School(req.body);
    await newSchool.save();
    res.json(newSchool);
});

// Récupérer les élèves
app.get('/api/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// Ajouter/Mettre à jour un élève
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));

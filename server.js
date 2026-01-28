const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Configuration pour Render (Port dynamique)
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());

// Charger les données du fichier JSON
const loadData = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return { schools: [], students: [] };
        }
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error("Erreur de lecture du fichier JSON:", error);
        return { schools: [], students: [] };
    }
};

// Sauvegarder les données dans le fichier JSON
const saveData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Erreur d'écriture du fichier JSON:", error);
    }
};

// --- ROUTES ---

// Récupérer toutes les données
app.get('/api/data', (req, res) => {
    res.json(loadData());
});

// Authentification
app.post('/api/login', (req, res) => {
    const { user, pass } = req.body;
    const data = loadData();
    
    // MOT DE PASSE : wilson eliotta mwenda 2003
    if (user === 'admin' && pass === 'wilson eliotta mwenda 2003') {
        return res.json({ role: 'ADMIN', name: 'Super Admin' });
    }
    
    const school = data.schools.find(s => s.staffUser === user && s.staffPass === pass);
    if (school) {
        return res.json({ role: 'STAFF', schoolId: school.id, name: school.name });
    }
    
    res.status(401).json({ message: "Identifiants incorrects" });
});

// Sauvegarder les écoles
app.post('/api/schools', (req, res) => {
    const data = loadData();
    data.schools = req.body;
    saveData(data);
    res.json({ message: "Écoles mises à jour" });
});

// Sauvegarder les élèves
app.post('/api/students', (req, res) => {
    const data = loadData();
    data.students = req.body;
    saveData(data);
    res.json({ message: "Élèves mis à jour" });
});

// Lancer le serveur sur 0.0.0.0 pour Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

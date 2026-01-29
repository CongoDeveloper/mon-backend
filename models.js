const mongoose = require('mongoose');

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
    id: String, // ID Élève
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
    history: { type: Map, of: String } // Stocke { "2024-05-20": "Présent" }
});

const School = mongoose.model('School', SchoolSchema);
const Student = mongoose.model('Student', StudentSchema);

module.exports = { School, Student };

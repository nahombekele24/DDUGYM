const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET_KEY = "your_ddu_gym_secret_key";

const frontendPath = path.join(__dirname, '..', 'Frontend');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(frontendPath)); 

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'DDUGYM'
});

db.connect(err => {
    if (err) console.error('DB Connection Failed:', err.message);
    else console.log('Connected to DDUGYM Database');
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: "No token provided" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Session expired" });
        req.userId = decoded.userId; 
        next();
    });
};

app.get('/', (req, res) => { res.sendFile(path.join(frontendPath, 'index.html')); });
app.get('/dashboard', (req, res) => { res.sendFile(path.join(frontendPath, 'dashboard.html')); });

app.post('/api/register', async (req, res) => {
    try {
        const { first_name, last_name, date_of_birth, email, password, phone, street_address, plan_id } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO Members (first_name, last_name, date_of_birth, email, password, phone, department, plan_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [first_name, last_name, date_of_birth, email, hashedPassword, phone, street_address, plan_id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: "Registration successful" });
        });
    } catch (error) { res.status(500).json({ error: "Server error" }); }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM Members WHERE email = ?", [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: "User not found" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
        
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token });
    });
});

app.get('/api/member-info', verifyToken, (req, res) => {
    const sql = `SELECT * FROM Members WHERE id = ?`;

    db.query(sql, [req.userId], (err, results) => {
        if (err) {
            console.error("❌ DB Error:", err.sqlMessage);
            return res.status(500).json({ error: "Database error: " + err.sqlMessage });
        }

        if (results.length === 0) return res.status(404).json({ error: "Member not found" });

        let user = results[0];
        const plans = {
            "1": "Monthly Basic (600 Birr)",
            "2": "Annual Premium (6500 Birr)",
            "3": "Student Discount (400 Birr)"
        };
        user.plan_name = plans[user.plan_id] || "Standard Plan";

        res.json(user);
    });
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

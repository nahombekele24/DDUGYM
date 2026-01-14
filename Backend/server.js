const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require("./routes/authRoutes"); 

const app = express();
const PORT = 3000;
const frontendPath = path.join(__dirname, '..', 'Frontend');

app.use(cors());
app.use(express.json()); 
app.use(express.static(frontendPath)); 

// 1. API Routes
app.use("/api/auth", authRoutes);

// 2. Health Check
app.get("/check", (req, res) => {
    res.send("The server is working");
});

// 3. Specific HTML Routes
app.get('/', (req, res) => { res.sendFile(path.join(frontendPath, 'index.html')); });
app.get('/dashboard', (req, res) => { res.sendFile(path.join(frontendPath, 'dashboard.html')); });

// 4. FIXED WILDCARD: Using a regex literal to avoid PathError in Node v25
app.get(/^((?!\/api).)*$/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
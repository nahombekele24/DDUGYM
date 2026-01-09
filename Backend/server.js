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

app.use("/api/auth", authRoutes);

app.get("/check", (req, res) => {
    res.send("The server is working");
});

app.get('/', (req, res) => { res.sendFile(path.join(frontendPath, 'index.html')); });
app.get('/dashboard', (req, res) => { res.sendFile(path.join(frontendPath, 'dashboard.html')); });

app.get(/^((?!\/api).)*$/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});


app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

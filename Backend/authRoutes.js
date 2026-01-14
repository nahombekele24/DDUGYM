const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authController = require("../controllers/authController");

const SECRET_KEY = "your_ddu_gym_secret_key";

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: "No token provided" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Session expired" });
        req.userId = decoded.userId;
        next();
    });
};

router.post("/register", authController.Register);
router.post("/login", authController.Login);
router.get("/member-info", verifyToken, authController.GetMemberInfo);
router.get("/users", verifyToken, authController.GetAllUsers);

module.exports = router;
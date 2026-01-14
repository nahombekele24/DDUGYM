const AuthService = require("../services/authServices");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET_KEY = "your_ddu_gym_secret_key";

exports.Register = async (req, res) => {
    try {
        const existingUser = await AuthService.findUserByEmail(req.body.email);
        if (existingUser) return res.status(400).json({ error: "Email already registered" });
        await AuthService.createMember(req.body);
        res.status(200).json({ message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await AuthService.findUserByEmail(email);
        if (!user) return res.status(401).json({ error: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

        const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ message: "Login successful", token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: "Server error during login" });
    }
};

exports.GetMemberInfo = async (req, res) => {
    try {
        const user = await AuthService.findUserById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found in database" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

exports.GetAllUsers = async (req, res) => {
    try {
        const users = await AuthService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
};
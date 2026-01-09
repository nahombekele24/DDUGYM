const AuthService = require("../services/authServices");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET_KEY = "your_ddu_gym_secret_key";

exports.Register = async (req, res) => {
    try {
        const existingUser = await AuthService.findUserByEmail(req.body.email);
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        await AuthService.createMember(req.body);
        res.status(200).json({ message: "Registered Successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await AuthService.findUserByEmail(email);

        if (!user) return res.status(401).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.GetMemberInfo = async (req, res) => {
    try {
        const user = await AuthService.getMemberById(req.userId);
        if (!user) return res.status(404).json({ error: "Member not found" });

        const plans = { "1": "Monthly Basic", "2": "Annual Premium", "3": "Student Discount" };
        user.plan_name = plans[user.plan_id] || "Standard Plan";
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
};

exports.GetAllUsers = async (req, res) => {
    try {
        const users = await AuthService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
};
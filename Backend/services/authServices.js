const db = require("../config/db_config");
const bcrypt = require("bcryptjs");

class AuthService {
    // Check if user exists
    async findUserByEmail(email) {
        const [rows] = await db.query("SELECT * FROM Members WHERE email = ?", [email]);
        return rows[0];
    }

    // Hash password and save user
    async createMember(userData) {
        const { first_name, last_name, date_of_birth, email, password, phone, street_address, plan_id } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const sql = `INSERT INTO Members (first_name, last_name, date_of_birth, email, password, phone, department, plan_id) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        return await db.query(sql, [first_name, last_name, date_of_birth, email, hashedPassword, phone, street_address, plan_id]);
    }

    // Get specific member details
    async getMemberById(userId) {
        const [rows] = await db.query("SELECT * FROM Members WHERE id = ?", [userId]);
        return rows[0];
    }

    // Get all users for admin
    async getAllUsers() {
        const [rows] = await db.query("SELECT id, first_name, last_name, email, department, role FROM Members");
        return rows;
    }
}

module.exports = new AuthService();
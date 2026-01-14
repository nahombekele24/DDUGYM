const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "", 
    database: "DDUGYM"
});

pool.getConnection()
    .then(connection => {
        console.log("✅ DDUGYM Database Connected");
        connection.release();
    })
    .catch(err => console.error("❌ DB Connection Failed:", err.message));

module.exports = pool;
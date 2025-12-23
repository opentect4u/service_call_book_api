const mysql = require('mysql2');


const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
});

db.getConnection((err, connection) => {
    if (err) console.log(err);
    connection.release();
    return;
})

module.exports = db;
const mysql = require('mysql');


const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'ServiceCallBook',
    password: 'ServiceCallBook@123',
    database: 'service_call_book'
});

db.getConnection((err, connection) => {
    if (err) console.log(err);
    connection.release();
    return;
})

module.exports = db;
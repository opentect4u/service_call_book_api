const dateFormat = require('dateformat');
const db = require('../db');
let data = {};
let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

const InsertClientType = (args) => {
    const { client_type, user_id } = args;
    let sql = `INSERT INTO md_client_type (client_type, created_by, created_dt) VALUES ("${client_type}", "${user_id}", "${datetime}")`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, insertId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Inserted Successfully !!' };
            }
            resolve(data);
        })
    })
}

module.exports = { InsertClientType };
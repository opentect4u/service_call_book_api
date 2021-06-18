const db = require('../db');
const dateFormat = require('dateformat');
let data = {};

const input_emp = (args) => {
    const { emp_code, emp_name, phone_no, email, emp_designation, remarks, code_no } = args;
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let sql = `INSERT INTO md_employee(emp_code, emp_name, phone_no, email, emp_designation, remarks, created_by, created_dt) VALUES ("${emp_code}", "${emp_name}", "${phone_no}", "${email}", "${emp_designation}", "${remarks}", "${code_no}", "${datetime}")`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) { data = { success: 0, message: 'Data Not Inserted' }; console.log({ msg: err }); }
            else {
                data = { success: 1, message: 'Data Inserted Successfully' };
            }
            resolve(data);
        })
    })
}

const empSave = (args) => {
    const { emp_code, emp_name, phone_no, email, emp_designation, remarks } = args;
    let sql = `SELECT * FROM md_employee WHERE emp_code = ${emp_code}`;
    return new Promise((resolve, reject) => {
        db.query(sql, async (err, result) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            }
            if (result.length > 0) {
                data = { success: 0, message: 'User Already Exist' };
            } else {
                data = await input_emp(args);
            }
            console.log(data);
            resolve(data);
        })
    })
}

module.exports = { empSave };
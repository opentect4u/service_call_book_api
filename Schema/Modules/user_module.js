const bcrypt = require('bcrypt');
const dateFormat = require('dateformat');
const db = require('../db');
let data = {};

const insert = (args) => {
    const { code_no, user_type, user_id, password } = args;
    return new Promise(async (resolve, reject) => {
        const pass = bcrypt.hashSync(password, 10);
        var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        var approval_flag = user_type != 'C' ? 'U' : 'A';
        let sql = `INSERT INTO md_users (user_id, password, code_no, user_type, approval_flag, user_status, created_by, created_dt) VALUES ("${user_id}", "${pass}", "${code_no}", "${user_type}", "${approval_flag}", "A", "${code_no}", "${datetime}")`;
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log({ msg: err });
                //data = { success: 0, message: 'Data Not Inserted' };
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Inserted Successfully' };
            }
            resolve(data);
        })
    })
}

const InsertUser = (args) => {
    const { code_no, user_type, user_id, password } = args;
    return new Promise(async (resolve, reject) => {
        //let data = '';
        //let check_user_sql = `SELECT * FROM md_users WHERE user_type = "${user_type}" AND code_no = "${code_no}"`;
        let check_user_sql = `SELECT * FROM md_users WHERE code_no = "${code_no}"`;
        await db.query(check_user_sql, async (err, result) => {
            if (err) {
                console.log(err);
                data = { success: 0, message: 'Something Went Wrong' };
            }
            if (result.length > 0) {
                data = { success: 2, message: 'Data Already Exist' };
            } else {
                data = await insert(args);
            }
            resolve(data);
        })
    })
}

const UserLogin = (args) => {
    const { user_id, password } = args;
    return new Promise((resolve, reject) => {
        let status = '';
        let sql = `SELECT * FROM md_users WHERE user_id = "${user_id}"`;
        db.query(sql, async (err, result) => {
            if (err) {
                console.log(err);
                data = { success: 0, message: 'Something Went Wrong' };
            }
            if (result.length > 0) {
                if (await bcrypt.compare(password, result[0].password)) {
                    data = { success: 1, message: JSON.stringify(result) };
                } else {
                    data = { success: 0, message: 'Please Check Your User ID Or Password' }
                }
            } else {
                data = { success: 0, message: 'No Data Found' };
            }
            // console.log(result[0].password);
            resolve(data);
        });
    })
}

const CheckUser = (args) => {
    const { code_no } = args;
    //let sql = `SELECT emp_name as name, email, phone_no FROM md_employee WHERE emp_code = ${code_no}`;
	let sql = `SELECT a.emp_name as name, a.email, a.phone_no, IF(b.id>0, b.id, 0) as log_done FROM md_employee a LEFT JOIN md_users b ON a.emp_code=b.code_no WHERE a.emp_code = "${code_no}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) { console.log({ msg: err }); data = { success: 0, message: JSON.stringify(err) }; }
            if (result.length > 0) {
				if(result[0].log_done > 0){
					data = { success: 2, message: JSON.stringify(result) };
				}else{
					data = { success: 1, message: JSON.stringify(result) };
				}
                
            } else {
                data = { success: 0, message: 'No Data Found.. Please Contact With Admin' };
            }
            resolve(data);
        })
    })
}

module.exports = { InsertUser, UserLogin, CheckUser };
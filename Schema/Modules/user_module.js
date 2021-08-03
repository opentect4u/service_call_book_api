const bcrypt = require('bcrypt');
const dateFormat = require('dateformat');
const nodemailer = require('nodemailer');
const Buffer = require('buffer').Buffer;
const db = require('../db');
let data = {};

const insert = (args) => {
    const { code_no, user_type, user_id, password } = args;
    return new Promise(async (resolve, reject) => {
        const pass = bcrypt.hashSync(password, 10);
        var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        var approval_flag = user_type != 'C' ? 'U' : 'A';
        let sql = `INSERT INTO md_users (user_id, password, code_no, user_type, approval_flag, user_status, created_by, created_dt) VALUES ("${user_id}", "${pass}", "${code_no}", "${user_type}", "${approval_flag}", "A", "${code_no}", "${datetime}")`;
        db.query(sql, async (err, lastId) => {
            if (err) {
                console.log({ msg: err });
                //data = { success: 0, message: 'Data Not Inserted' };
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                await send_email(user_id);
                data = { success: 1, message: 'Please check your mail to activate your account' };
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
        let check_user_sql = `SELECT * FROM md_users WHERE code_no = "${code_no}" AND user_type = "${user_type}"`;
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
        let sql = `SELECT a.*, IF(a.user_type = 'C', c.client_name, b.emp_name)as emp_name FROM md_users a LEFT JOIN md_employee b ON a.code_no=b.emp_code LEFT JOIN md_client c ON a.code_no=c.id WHERE a.user_id = "${user_id}" AND a.user_status="A" AND a.approval_flag = 'A'`;
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
                data = { success: 0, message: 'User Is Deactivated Or No Data Found' };
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
                if (result[0].log_done > 0) {
                    data = { success: 2, message: JSON.stringify(result) };
                } else {
                    data = { success: 1, message: JSON.stringify(result) };
                }

            } else {
                data = { success: 0, message: 'No Data Found.. Please Contact With Admin' };
            }
            resolve(data);
        })
    })
}

const GetUserDetails = (args) => {
    const { tag } = args;
    var tag_val = tag == '1' ? 'A' : 'D';
    var active = tag == '1' ? `WHERE a.user_status = "${tag_val}"` : (tag == '0' ? `WHERE a.user_status = "${tag_val}"` : '');
    var sql = `SELECT a.*, b.emp_name as user_name FROM md_users a JOIN md_employee b ON a.code_no = b.emp_code ${active}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = result;
            }
            resolve(data);
        })
    })
}

const UpdateUserType = (args) => {
    const { id, user_type, user_id } = args;
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `UPDATE md_users SET user_type = "${user_type}", modified_by = "${user_id}", modified_dt = "${datetime}" WHERE id = "${id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Updated Successfully !!' };
            }
            resolve(data);
        })
    })
}

const UpdateUserStatus = (args) => {
    const { id, user_status, user_id } = args;
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `UPDATE md_users SET user_status = "${user_status}", modified_by = "${user_id}", modified_dt = "${datetime}" WHERE id = "${id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Updated Successfully !!' };
            }
            resolve(data);
        })
    })
}

const GetUserDetailsById = (args) => {
    const { user_id } = args;
    var sql = `SELECT * FROM md_users WHERE code_no=${user_id}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = result;
            }
            resolve(data);
        })
    })
}

const send_email = async (email_id) => {
    let email_en = Buffer.from(email_id).toString('base64');
    var transporter = nodemailer.createTransport({
        host: 'webmail.synergicportal.in',
        port: 25,
        secure: false,
        auth: {
            user: 'support@synergicportal.in',
            pass: 'Support!sSs#2021'
        },
        tls: { rejectUnauthorized: false }
    });
    var mailOptions = {
        from: 'support@synergicportal.in',
        to: email_id,
        subject: 'SynergicPortal',
        html: '<!doctype html>'
            + '<html>'
            + '<head>'
            + '<meta charset="utf-8">'
            + '<title>HomeworkHelp</title>'
            + '<style type="text/css">body{font - size: 14px; color: #494949; font-size: 15px; margin: 0; padding: 0;}</style>'
            + '</head>'
            + '<body>'
            + '<div style="max-width: 830px; margin: 0 auto; padding: 0 15px;">'
            + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
            + '<tbody>'
            + '<tr>'
            + '<td align="left" valign="top" style="text-align: center; padding: 14px 0; border-bottom: #ef3e36 solid 3px;"><img src="https://support.synergicportal.in/assets/Login_assets/images/logo.png" width="171" height="43" alt="" /></td>'
            + '</tr>'
            + '<tr>'
            + '<td align="left" valign="top" style="padding: 25px 15px 5px 15px; font-family: Arial; font-size: 15px; line-height: 25px;">'
            + '<p style=" padding: 0 0 25px 0; margin: 0; font-family: Arial; font-size: 15px; color: #494949;">Please <a href="https://support.synergicportal.in/#/template?id=' + email_en + '">click here</a> to activate your account.</p>'
            + '</td>'
            + '</tr>'
            + '</tbody>'
            + '</table>'
            + '</div>'
            + '</body>'
            + '</html>'
    };
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        console.log('Email sent: ' + info.response);
    })
}

const UpdateApprovalFlag = (args) => {
    const { email_id } = args;
    var email = Buffer.from(email_id, 'base64').toString('ascii');
    var sql = `UPDATE md_users SET approval_flag='A' WHERE user_id = '${email}'`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Successfully Approved!!!' };
            }
            resolve(data);
        })
    })
}

const CheckEmail = (args) => {
    const { email_id } = args;
    var sql = `SELECT * FROM md_users WHERE user_id = "${email_id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } if (result.length > 0) {
                data = { success: 1, message: 'Email Exist' };
            } else {
                data = { success: 0, message: 'Email ID Is Not Registered' };
            }
            resolve(data);
        })
    })
}

const ForgotPassword = (args) => {
    const { email_id } = args;
    var password = 'password';
    const pass = bcrypt.hashSync(password, 10);
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `UPDATE md_users SET password = "${pass}", modified_by = "${email_id}", modified_dt = "${datetime}" WHERE user_id = "${email_id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, async (err, lastId) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                // FOR LOCAL
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'synergicbbps@gmail.com',
                        pass: 'Signature@123'
                    }
                });

                // FOR SERVER

                // var transporter = nodemailer.createTransport({
                //     host: 'webmail.synergicportal.in',
                //     port: 25,
                //     secure: false,
                //     auth: {
                //         user: 'support@synergicportal.in',
                //         pass: 'Support!sSs#2021'
                //     },
                //     tls: { rejectUnauthorized: false }
                // });
                var mailOptions = {
                    from: 'support@synergicportal.in',
                    to: "samantasubham9804@gmail.com",//email_id,
                    subject: 'SynergicPortal',
                    html: '<!doctype html>'
                        + '<html>'
                        + '<head>'
                        + '<meta charset="utf-8">'
                        + '<title>HomeworkHelp</title>'
                        + '<style type="text/css">body{font - size: 14px; color: #494949; font-size: 15px; margin: 0; padding: 0;}</style>'
                        + '</head>'
                        + '<body>'
                        + '<div style="max-width: 830px; margin: 0 auto; padding: 0 15px;">'
                        + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
                        + '<tbody>'
                        + '<tr>'
                        + '<td align="left" valign="top" style="text-align: center; padding: 14px 0; border-bottom: #ef3e36 solid 3px;"><img src="https://support.synergicportal.in/assets/Login_assets/images/logo.png" width="171" height="43" alt="" /></td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td align="left" valign="top" style="padding: 25px 15px 5px 15px; font-family: Arial; font-size: 15px; line-height: 25px;">'
                        + '<center><p style=" padding: 0 0 25px 0; margin: 0; font-family: Arial; font-size: 15px; color: #494949;"><span style="color: #2fd025;">Your Password Reseted Successsfully..</span></p></center>'
                        + '<p style=" padding: 0 0 25px 0; margin: 0; font-family: Arial; font-size: 15px; color: #494949;">Please try to login with new password <b><i>"password"</i></b>.</p>'
                        + '<p style=" padding: 0 0 25px 0; margin: 0; font-family: Arial; font-size: 15px; color: #494949;"><b><small><i><span style="color: #d02525; font-size: 11px;">PLEASE RESET YOUR PASSWORD AFTER LOGIN, FOR SECURITY PURPOSE.</span></i></small></b></p>'
                        + '</td>'
                        + '</tr>'
                        + '</tbody>'
                        + '</table>'
                        + '</div>'
                        + '</body>'
                        + '</html>'
                };
                await transporter.sendMail(mailOptions, (error, info) => {
                    if (error) console.log(error);
                    console.log('Email sent: ' + info.response);
                })
                data = { success: 1, message: 'Please Check Your Email For New Password' };
            }
            resolve(data);
        })
    })
}

module.exports = { InsertUser, UserLogin, CheckUser, GetUserDetails, UpdateUserType, UpdateUserStatus, GetUserDetailsById, UpdateApprovalFlag, CheckEmail, ForgotPassword };
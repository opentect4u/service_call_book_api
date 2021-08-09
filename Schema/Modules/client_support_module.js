const db = require('../db');
const dateFormat = require('dateformat');
const { GetTktNo } = require('./support_log_module');
var data = {};
var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

const ClientGetTkt = (args) => {
    var { client_id, id } = args;
    var whr_cls = id > 0 && id != '' ? `AND a.id = "${id}"` : '';
    var sql = `SELECT a.*, b.client_name, c.district_name, d.client_type, e.oprn_mode, b.client_addr,
                b.rental_upto, b.working_hrs, b.rental_upto, f.module_type, g.tkt_status as tktStatus
                FROM td_support_log a
                JOIN md_client b ON a.client_id=b.id
                JOIN md_district c ON b.district_id=c.id
                JOIN md_client_type d ON b.client_type_id=d.id
                JOIN md_oprn_mode e ON b.oprn_mode_id=e.id
                JOIN md_module f ON a.tkt_module=f.id
                LEFT JOIN md_tkt_status g ON a.tkt_status=g.id
                WHERE a.client_id = "${client_id}" ${whr_cls} AND a.work_status != '0'`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = result;
            }
            resolve(data);
        })
    })
}

const ClientTktSave = async (args) => {
    const { client_id, tkt_module, phone_no, priority_status, prob_reported, remarks, user_id } = args;
    const tkt_no = await GetTktNo();
    const tmstamp = dateFormat(new Date(), "ddmmyy");
    var tkt = `T/${tmstamp}/${client_id}/${tkt_no[0].id}`;
    var sql = `INSERT INTO td_support_log
    (tkt_no, client_id, tkt_module, log_in, phone_no, priority_status, prob_reported, remarks, created_by, created_dt)
     VALUES ("${tkt}", "${client_id}", "${tkt_module}", "${datetime}", "${phone_no}", "${priority_status}",
     "${prob_reported}", "${remarks}", "${user_id}", "${datetime}")`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Insert Successfully !!' };
            }
            resolve(data);
        })
    })
}

module.exports = { ClientGetTkt, ClientTktSave };
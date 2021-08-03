const db = require('../db');
const dateFormat = require('dateformat');
var data = {};
var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

const GetTktNo = () => {
    var sql = `SELECT ifnull(MAX(id)+1,1) id FROM td_support_log`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log({ success: 0, message: JSON.stringify(err) });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = result;
            }
            resolve(data);
        })
    })
}

const SupLogGet = (args) => {
    const { id, tag, user_type, user_id } = args;
    var where = id != '' && id > 0 ? `WHERE a.id = ${id}` : '';
    var suf = id != '' && id > 0 ? 'AND' : 'WHERE';
    var assin = tag == '1' && tag != '' ? `${suf} assign_engg IS NULL` : (tag == '0' && tag != '' ? `${suf} assign_engg IS NOT NULL AND work_status='0'` : (tag == '2' && tag != '' ? `${suf} work_status='0'` : ''));
	var pre_user = id > 0 || tag >= 0 ? 'AND' : 'WHERE';
	var user = user_type == 'E'? `${pre_user} a.assign_engg="${user_id}"` : '';
    var sql = `SELECT a.*, b.client_name, c.district_name, d.client_type, e.oprn_mode, b.working_hrs, b.amc_upto, b.rental_upto, 
    f.priority_mode priority, g.module_type module, h.emp_name, i.tkt_status as tktStatus
    FROM td_support_log a
    JOIN md_client b ON a.client_id=b.id
    JOIN md_district c ON b.district_id=c.id
    JOIN md_client_type d ON b.client_type_id=d.id
    JOIN md_oprn_mode e ON b.oprn_mode_id=e.id
    JOIN md_priority_mode f ON a.priority_status=f.id
    JOIN md_module g ON a.tkt_module=g.id
    LEFT JOIN md_employee h ON a.assign_engg=h.emp_code
	LEFT JOIN md_tkt_status i ON a.tkt_status=i.id ${where} ${assin} ${user} ORDER BY a.id`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            // console.log(result);
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = result;
				//data = { success: 0, message: sql };
            }
            resolve(data);
        })
    })
}

const SupLogEntry = async (args) => {
    const { client_id, tkt_module, phone_no, priority_status, prob_reported, remarks, user_id } = args;
    const tkt_no = await GetTktNo();
    const tmstamp = dateFormat(new Date(), "ddmmyy");
    var tkt = `T/${tmstamp}/${client_id}/${tkt_no[0].id}`;
    console.log(tmstamp);
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

const UpdateRaiseTkt = (args) => {
    const { id, tkt_module, phone_no, priority_status, prob_reported, remarks, user_id } = args;
    var sql = `UPDATE td_support_log SET tkt_module="${tkt_module}", phone_no="${phone_no}", priority_status="${priority_status}", prob_reported="${prob_reported}", remarks="${remarks}", modified_by="${user_id}", modified_dt="${datetime}" WHERE id="${id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, insertId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Updated Successfully !!' };
            }
            resolve(data);
        })
    })
}

const UpdateAssignTkt = (args) => {
    const { id, assign_engg, remarks, user_id } = args;
    var sql = `UPDATE td_support_log SET assign_engg="${assign_engg}", remarks="${remarks}", modified_by="${user_id}", modified_dt="${datetime}" WHERE id="${id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: "Updated Successfully!!" };
            }
            resolve(data);
        })
    })
}

const UpdateDeliverTkt = (args) => {
    const { id, call_attend, delivery, tkt_status, remarks, work_status, user_id } = args;
    var sql = `UPDATE td_support_log SET call_attend="${call_attend}", delivery="${delivery}", tkt_status="${tkt_status}", remarks="${remarks}", work_status="${work_status}", modified_by="${user_id}", modified_dt="${datetime}" WHERE id="${id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: "Updated Successfully!!" };
            }
            resolve(data);
        })
    })
}

const DeleteTkt = (args) => {
    const { id } = args;
    var sql = `DELETE FROM td_support_log WHERE id = "${id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Deleted Successfully!!' };
            }
            resolve(data)
        })
    })
}

module.exports = { SupLogEntry, SupLogGet, UpdateRaiseTkt, UpdateAssignTkt, UpdateDeliverTkt, DeleteTkt };
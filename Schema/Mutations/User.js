const { GraphQLString, GraphQLID, GraphQLInt } = require("graphql");
const bcrypt = require('bcrypt');
const dateFormat = require('dateformat');
const { UserType } = require("../TypeDefs/User");
const db = require('../db');


const create_user = {
    type: UserType,
    args: {
        code_no: { type: GraphQLInt },
        user_type: { type: GraphQLString },
        user_id: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(parent, args) {
        const { code_no, user_type, user_id, password } = args;
        const data_error = '';
        let check_user_sql = `SELECT * FROM md_users WHERE user_type = "${user_type}" AND code_no = "${code_no}"`;
        await db.query(check_user_sql, async (err, result) => {
            if (err) {
                console.log(err);
                // throw new Error(err);
                data_error = JSON.stringify({ message: err, status: 0 });
            }
            if (result.length > 0) {
                console.log(result);
                // throw new Error('User Already Registered');
                data_error = JSON.stringify({ message: 'User Already Registered', status: 0 });
            } else {
                const pass = bcrypt.hashSync(password, 10);
                var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
                var approval_flag = user_type != 'C' ? 'U' : 'A';
                let sql = `INSERT INTO md_users (user_id, password, code_no, user_type, approval_flag, user_status, created_by, created_dt) VALUES ("${user_id}", "${pass}", "${code_no}", "${user_type}", "${approval_flag}", "A", "${code_no}", "${datetime}")`;
                await db.query(sql, (err, lastId) => {
                    if (err) {
                        console.log({ msg: err });
                        // throw new Error('Data Not Inserted');
                        data_error = JSON.stringify({ message: 'Data Not Inserted', status: 0 });
                    }
                    // console.log(result);
                    // if(lastId){reso(lastId)}
                    // console.log(lastId.insertId);
                    // return new Promise(async (reso, reject) => {
                    // await db.query(`SELECT * FROM users WHERE id = ${lastId.insertId}`, (err, result) => {
                    //     if (err) console.log({ insert_err: err });
                    //         console.log(result);
                    //         reso(result);
                    //     });
                    // });
                })
            }

        })
        console.log({ message: data_error });
        if (data_error != '') {
            return args;
        } else {
            throw new Error({ message: 'Data Not Inserted', status: 0 });
        }

    }
}

const update_user = {
    type: UserType,
    args: { id: { type: GraphQLID }, password: { type: GraphQLString } },
    async resolve(parent, args) {
        const { id, password } = args;
        const pass = bcrypt.hashSync(password, 10);
        var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        let sql = `UPDATE users SET password = "${pass}", updatedAt = "${datetime}" WHERE id = "${id}"`;
        console.log(sql);
        await db.query(sql, (err, result) => {
            if (err) console.log({ update_err: err });
            console.log(result);
        });
        return args;
    }
}

const delete_user = {
    type: UserType,
    args: {
        id: { type: GraphQLID }
    },
    async resolve(parent, args) {
        const { id } = args;
        let sql = `DELETE FROM users WHERE id = ${id}`;
        await db.query(sql, (err, lastId) => {
            if (err) console.log({ msg: err });

        })
        return 'Deleted Successfully';
    }
}

module.exports = { create_user, delete_user, update_user };
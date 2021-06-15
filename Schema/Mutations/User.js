const { GraphQLString, GraphQLID, GraphQLInt } = require("graphql");
const bcrypt = require('bcrypt');
const dateFormat = require('dateformat');
const { UserType } = require("../TypeDefs/User");
const db = require('../db');
const { InsertUser } = require('../Modules/user_module');
const { MessageType } = require('../TypeDefs/Messages');

const create_user = {
    type: MessageType,
    args: {
        code_no: { type: GraphQLInt },
        user_type: { type: GraphQLString },
        user_id: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var status = await InsertUser(args);
        return status;

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
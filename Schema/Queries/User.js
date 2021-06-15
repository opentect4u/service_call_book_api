const { GraphQLList, printError } = require('graphql')
const { UserType } = require('../TypeDefs/User')
const db = require('../db');

const get_all_users = {
    type: new GraphQLList(UserType),
    resolve() {
        let sql = `SELECT * FROM md_users`;
        return new Promise((reso, reject) => {
            db.query(sql, (err, result) => {
                var error = '';
                if (err) {
                    error = err; throw Error(err); console.log({ msg: err });
                } else {
                    error = { message: 'No Data Found', status: 0 };
                }
                // console.log(result.length);
                if (result.length > 0) {
                    reso(result);
                } else {
                    return printError(error);
                }
            });
        })
        // return "Subham Samanta";
    }
}

module.exports = { get_all_users };
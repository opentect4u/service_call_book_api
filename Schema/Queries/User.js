const { GraphQLList, printError, GraphQLString } = require('graphql')
const { UserType } = require('../TypeDefs/User')
const db = require('../db');
const { UserLogin, CheckUser } = require('../Modules/user_module');
const { MessageType } = require('../TypeDefs/Messages');

const user_login = {
    type: MessageType,
    args: { user_id: { type: GraphQLString }, password: { type: GraphQLString } },
    async resolve(parent, args) {
        const status = await UserLogin(args);
        // console.log(status);
        return status;
    }
}

const check_user = {
    type: MessageType,
    args: { code_no: { type: GraphQLString } },
    async resolve(parent, args) {
        const status = await CheckUser(args);
        // console.log(status);
        return status;
    }
}

module.exports = { user_login, check_user };
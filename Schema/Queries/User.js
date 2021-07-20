const { GraphQLList, printError, GraphQLString } = require('graphql')
const { UserType } = require('../TypeDefs/User')
const db = require('../db');
const { UserLogin, CheckUser, GetUserDetails } = require('../Modules/user_module');
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

const get_user_details = {
    type: new GraphQLList(UserType),
    args: { tag: { type: GraphQLString } },
    async resolve(parent, args) {
        const result = await GetUserDetails(args);
        return result;
    }
}

module.exports = { user_login, check_user, get_user_details };
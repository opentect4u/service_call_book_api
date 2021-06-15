const { GraphQLList, printError, GraphQLString } = require('graphql')
const { UserType } = require('../TypeDefs/User')
const db = require('../db');
const { UserLogin } = require('../Modules/user_module');
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

module.exports = { user_login };
const { GraphQLString, GraphQLID, GraphQLInt } = require("graphql");
const { buildResolveInfo } = require("graphql/execution/execute");
const { InsertClientType } = require("../Modules/master_module");
const { MessageType } = require("../TypeDefs/Messages");

const create_client_type = {
    type: MessageType,
    args: {
        client_type: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var status = await InsertClientType(args);
        return status;
    }
}

module.exports = { create_client_type };
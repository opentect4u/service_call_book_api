const { GraphQLString, GraphQLInt } = require("graphql");
const { ClientTktSave } = require("../Modules/client_support_module");
const { MessageType } = require("../TypeDefs/Messages");

const client_tkt_save = {
    type: MessageType,
    args: {
        client_id: { type: GraphQLString },
        tkt_module: { type: GraphQLString },
        phone_no: { type: GraphQLString },
        priority_status: { type: GraphQLString },
        prob_reported: { type: GraphQLString },
        remarks: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await ClientTktSave(args);
        return result;
    }
}

module.exports = { client_tkt_save };
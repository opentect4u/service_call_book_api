const { GraphQLList, GraphQLString, GraphQLInt } = require("graphql");
const { SupLogGet } = require("../Modules/support_log_module");
const { MessageType } = require("../TypeDefs/Messages");
const { SupportLogTypDf } = require("../TypeDefs/support_log_typdf");


const get_supp_log = {
    type: new GraphQLList(SupportLogTypDf),
    args: {
        id: { type: GraphQLString },
        tag: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await SupLogGet(args);
        return result;
    }
}

module.exports = { get_supp_log };
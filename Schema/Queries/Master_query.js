const { GraphQLList, GraphQLString, GraphQLInt } = require("graphql");
const { GetMasterData } = require("../Modules/master_module");
const { masterTypeDf } = require("../TypeDefs/Master_typdf");


const get_master_data = {
    type: new GraphQLList(masterTypeDf),
    args: { id: { type: GraphQLString }, db_type: { type: GraphQLInt } },
    async resolve(parent, args) {
        var result = await GetMasterData(args);
        return result;
    }
}

module.exports = { get_master_data };
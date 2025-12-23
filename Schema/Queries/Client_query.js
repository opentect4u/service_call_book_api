const { GraphQLList, GraphQLID, GraphQLString, GraphQLInt } = require("graphql");
const { GetClient, GetDistrict, GetClientPri } = require("../Modules/client_module");
const { ClientTypeDf, DistrictType, ClientPrivilegeTypeDf } = require("../TypeDefs/Client_typdf");


const get_client = {
    type: new GraphQLList(ClientTypeDf),
    args: { id: { type: GraphQLString }, active: { type: GraphQLString } },
    async resolve(parent, args) {
        var status = await GetClient(args);
        return status;
    }
}

const get_client_privilege = {
    type: new GraphQLList(ClientPrivilegeTypeDf),
    args: { client_id: { type: GraphQLString }},
    async resolve(parent, args) {
        var status = await GetClientPri(args);
        return status;
    }
}

const get_district = {
    type: new GraphQLList(DistrictType),
    async resolve(parent, args) {
        var status = await GetDistrict();
        return status;
    }
}

module.exports = { get_client, get_district, get_client_privilege };
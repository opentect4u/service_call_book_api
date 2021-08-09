const { GraphQLList, GraphQLString, GraphQLInt } = require("graphql");
const { OpenCloseTkt, CloseTkt } = require("../Modules/dashboard_module");
const { openedClosedTktType, CloseTktType, CloseTktByStatusType } = require("../TypeDefs/Dashboard_typdf");

const open_close_tkt = {
    type: new GraphQLList(openedClosedTktType),
    args: {
        user_type: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await OpenCloseTkt(args);
        return result;
    }
}

const close_tkt = {
    type: new GraphQLList(CloseTktType),
    args: {
        user_type: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = CloseTkt(args);
        return result;
    }
}

const open_tkt_by_status = {
    type: new GraphQLList(CloseTktByStatusType),
    args: {
        user_type: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = CloseTkt(args);
        return result;
    }
}

module.exports = { open_close_tkt, close_tkt, open_tkt_by_status };
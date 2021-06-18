const { GraphQLObjectType, GraphQLString } = require("graphql");

const mdClientTypeDf = new GraphQLObjectType({
    name: 'md_client_type',
    fields: () => ({
        client_type: { type: GraphQLString }
    })
})

const mdOprnModeType = new GraphQLObjectType({
    name: 'md_oprn_mode',
    fields: () => ({
        oprn_mode: { type: GraphQLString }
    })
})

const mdTktStatusType = new GraphQLObjectType({
    name: 'md_tkt_status',
    fields: () => ({
        tkt_status: { type: GraphQLString }
    })
})

const mdPriorityModeType = new GraphQLObjectType({
    name: 'md_priority_mode',
    fields: () => ({
        priority_mode: { type: GraphQLString }
    })
})

const mdModuleType = new GraphQLObjectType({
    name: 'md_module',
    fields: () => ({
        module_type: { type: GraphQLString }
    })
})

module.exports = { mdClientTypeDf, mdOprnModeType, mdTktStatusType, mdPriorityModeType, mdModuleType };
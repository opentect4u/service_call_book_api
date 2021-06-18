const { GraphQLObjectType, GraphQLString, GraphQLID } = require("graphql");

const masterTypeDf = new GraphQLObjectType({
    name: 'masterData',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString }
    })
})

module.exports = { masterTypeDf };
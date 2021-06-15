const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt } = require('graphql');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        user_id : { type: GraphQLString },
        password: { type: GraphQLString },
        code_no: { type: GraphQLInt },
        user_type: { type: GraphQLString },
        approval_flag: { type: GraphQLString },
        user_status: { type: GraphQLString }
    }),
})

module.exports = {UserType};
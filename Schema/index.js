const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const { get_all_users } = require('./Queries/User');
const { create_user, delete_user, update_user } = require('./Mutations/User');

// console.log(USER.get_all_users);

const UserQuery = new GraphQLObjectType({
    name: 'UserQuery',
    fields: {
        GetAllUsers : get_all_users
    }
})

const UserMutation = new GraphQLObjectType({
    name: 'UserMutation',
    fields: {
        createUser: create_user,
        updateUser: update_user,
        deleteUser: delete_user
    }
})

const schema = new GraphQLSchema({
    query: UserQuery,
    mutation: UserMutation
})

module.exports = {schema};
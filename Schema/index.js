const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const { user_login, check_user } = require('./Queries/User');
const { create_user, delete_user, update_user } = require('./Mutations/User');
const { create_emp } = require("./Mutations/Emp_master");
const { create_client_type } = require("./Mutations/Master_mutation");

// console.log(USER.get_all_users);

const UserLogin = new GraphQLObjectType({
    name: 'UserLogin',
    fields: {
        userLogin: user_login,
        checkUser: check_user
    }
})

const UserMutation = new GraphQLObjectType({
    name: 'UserMutation',
    fields: {
        createUser: create_user,
        updateUser: update_user,
        deleteUser: delete_user,
        createClientType: create_client_type,
        insertEmpMaster: create_emp
    }
})

const schema = new GraphQLSchema({
    query: UserLogin,
    mutation: UserMutation
})

module.exports = { schema };
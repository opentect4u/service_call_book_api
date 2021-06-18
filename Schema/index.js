const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const { user_login, check_user } = require('./Queries/User');
const { create_user, delete_user, update_user } = require('./Mutations/User');
const { create_emp, update_emp } = require("./Mutations/Emp_master_mutation");
const { create_master_data, update_master_data } = require("./Mutations/Master_mutation");
const { get_master_data } = require("./Queries/Master_query");
const { get_emp } = require("./Queries/Emp_master_query");
const { get_client, get_district } = require("./Queries/Client_query");
const { create_client, update_client } = require("./Mutations/Client_mutation");

// console.log(USER.get_all_users);

const UserLogin = new GraphQLObjectType({
    name: 'UserLogin',
    fields: {
        userLogin: user_login,
        checkUser: check_user,
        getMasterData: get_master_data,
        getEmp: get_emp,
        getClient: get_client,
        getDistrict: get_district
    }
})

const UserMutation = new GraphQLObjectType({
    name: 'UserMutation',
    fields: {
        createUser: create_user,
        updateUser: update_user,
        deleteUser: delete_user,
        insertMaster: create_master_data,
        updateMaster: update_master_data,
        insertEmpMaster: create_emp,
        updateEmp: update_emp,
        insertClient: create_client,
        updateClient: update_client
    }
})

const schema = new GraphQLSchema({
    query: UserLogin,
    mutation: UserMutation
})

module.exports = { schema };
const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const { user_login, check_user, get_user_details } = require('./Queries/User');
const { create_user, delete_user, update_user, update_user_status, update_user_type, update_approve_status } = require('./Mutations/User');
const { create_emp, update_emp, delete_emp } = require("./Mutations/Emp_master_mutation");
const { create_master_data, update_master_data, delete_master_data } = require("./Mutations/Master_mutation");
const { get_master_data, get_client_type_data, get_tkt_status_data, get_oprn_mode_data, get_priotity_mode_data, get_module_type_data } = require("./Queries/Master_query");
const { get_emp } = require("./Queries/Emp_master_query");
const { get_client, get_district } = require("./Queries/Client_query");
const { create_client, update_client, delete_client } = require("./Mutations/Client_mutation");
const { create_tkt, update_assign_tkt, update_deliver_tkt, update_raise_tkt, delete_tkt } = require("./Mutations/Support_log_mutation");
const { get_supp_log } = require("./Queries/Support_log_query");

// console.log(USER.get_all_users);

const UserLogin = new GraphQLObjectType({
    name: 'UserLogin',
    fields: {
        userLogin: user_login,
        checkUser: check_user,
        getMasterData: get_master_data,
        getClientTypeData: get_client_type_data,
        getOprnModeData: get_oprn_mode_data,
        getTktStatusData: get_tkt_status_data,
        getPriorityModeData: get_priotity_mode_data,
        getModuleTypeData: get_module_type_data,
        getEmp: get_emp,
        getClient: get_client,
        getDistrict: get_district,
        getSupportLogDtls: get_supp_log,
        getUserDetails: get_user_details
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
        updateClient: update_client,
        deleteMaster: delete_master_data,
        deleteClient: delete_client,
        deleteEmp: delete_emp,
        createTkt: create_tkt,
        updateRaiseTkt: update_raise_tkt,
        updateAssignTkt: update_assign_tkt,
        updateDeliverTkt: update_deliver_tkt,
        deleteTkt: delete_tkt,
        updateUserStatus: update_user_status,
        updateUserType: update_user_type,
        approveUser: update_approve_status
    }
})

const schema = new GraphQLSchema({
    query: UserLogin,
    mutation: UserMutation
})

module.exports = { schema };
const { GraphQLList, GraphQLID, GraphQLString } = require("graphql");
const { GetEmpData } = require("../Modules/emp_master_module");
const { empMasterType } = require("../TypeDefs/Emp_master");


const get_emp = {
    type: new GraphQLList(empMasterType),
    args: { id: { type: GraphQLString } },
    async resolve(parent, args) {
        var status = await GetEmpData(args);
        return status;
    }
}

module.exports = { get_emp };
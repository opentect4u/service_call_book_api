const express = require('express');
const app = express();
const cors = require('cors');
const graphql = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const {schema} = require('./Schema');
const port = process.env.PORT || 3000;
const db = require('./Schema/db');

app.use(cors());
app.use(express.json());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(port, () => {
    console.log(`App is runnig at port: ${port}`);
})
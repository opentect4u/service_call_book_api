const express = require('express');
const app = express();
const cors = require('cors');
const graphql = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const {schema} = require('./Schema');
const port = process.env.PORT || 3000;
const db = require('./Schema/db');
// const mysql = require('mysql');

// let connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'table_user',
//     synchronoze: false
// });

//     connection.connect(function(err) {
//     if (err) {
//         console.log({msg: err});
//     }

//     else {console.log('Connected to the MySQL server.')};
//     });


// const db = mysql.createPool({
//     connectionLimit: 10,
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'table_user'
// });

// db.getConnection((err, connection) => {
//     if (err) console.log(err);
//     connection.release();
//     return;
// })


app.use(cors());
app.use(express.json());

// console.log(schema);

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(port, () => {
    console.log(`App is runnig at port: ${port}`);
})
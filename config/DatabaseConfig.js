const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({path: './config/.env'});

const dbconnection = mysql.createConnection({
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
})

dbconnection.connect((err) => {
    if(err) throw err;
    console.log("Database " + dbconnection.state);
});

module.exports = dbconnection;
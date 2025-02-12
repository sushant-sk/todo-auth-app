const Pool = require('pg').Pool //from postgresql documentation
const dotenv = require('dotenv').config()

const pool = new Pool({
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DBPORT,//per postgresql server
    database: 'todoapp'//name of the database in postgresql
})

module.exports = pool
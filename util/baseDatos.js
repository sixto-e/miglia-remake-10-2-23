// Hace las consultas asicronicas
const util = require('util');
// Módulo mysql
const mysql = require('mysql');
// Conecto la base de datos al proyecto
const pool = mysql.createPool({
    host: '45.152.44.52',
    port: '3306',
    password: 's]xN9M5a+S6',
    user: 'u217934892_Miglia',
    database: 'u217934892_Miglia',
    connectionLimit: 10
});

// Permito consultas asincronicas
pool.query = util.promisify(pool.query);
// Exporto la base de datos.
module.exports = pool;

// get the client
const mysql = require('mysql2');
const databaseName = "db_name_goes_here";

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
    host: 'db_host_goes_here',
    user: 'db_username_goes_here',
    password:'db_password_goes_here',
    database: databaseName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();

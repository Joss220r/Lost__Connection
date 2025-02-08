// config.js
require('dotenv').config(); // Permite usar variables de entorno definidas en un archivo .env

module.exports = {
  // Define el motor de base de datos a usar: 'mssql', 'mysql' o 'mongodb'
  dbType: process.env.DB_TYPE || 'mssql', 

  mssql: {
    server: process.env.MSSQL_SERVER || 'localhost',
    port: parseInt(process.env.MSSQL_PORT) || 1433,
    user: process.env.MSSQL_USER || 'sa',
    password: process.env.MSSQL_PASSWORD || 'YourStrong!Passw0rd',
    database: process.env.MSSQL_DATABASE || 'BANKING'
  },

  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'YourStrong!Passw0rd',
    database: process.env.MYSQL_DATABASE || 'BANKING'
  },

  mongodb: {
    // Ejemplo: mongodb://root:YourStrong!Passw0rd@localhost:27017/BANKING
    uri: process.env.MONGODB_URI || 'mongodb://root:YourStrong!Passw0rd@localhost:27017/BANKING'
  }
};

// index.js
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint de prueba
app.get('/api/test', async (req, res) => {
  const dbType = config.dbType;
  try {
    let result;
    switch(dbType) {
      case 'mssql':
        result = await testMSSQL();
        break;
      case 'mysql':
        result = await testMySQL();
        break;
      case 'mongodb':
        result = await testMongoDB();
        break;
      default:
        return res.status(400).json({ error: 'Tipo de base de datos no soportado' });
    }
    res.json({ dbType, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API REST corriendo en http://localhost:${port}`);
});

/* -------------------
   Funciones de prueba para cada motor
   ------------------- */

// Para SQL Server (MSSQL)
async function testMSSQL() {
  const sql = require('mssql');
  try {
    // Configuración para mssql
    const pool = await sql.connect(config.mssql);
    const result = await pool.request().query('SELECT TOP 1 * FROM sys.databases;');
    await pool.close();
    return result.recordset;
  } catch (error) {
    throw new Error('Error al conectar a MSSQL: ' + error.message);
  }
}

// Para MySQL/MariaDB
async function testMySQL() {
  const mysql = require('mysql2/promise');
  try {
    const connection = await mysql.createConnection(config.mysql);
    const [rows] = await connection.execute('SHOW DATABASES;');
    await connection.end();
    return rows;
  } catch (error) {
    throw new Error('Error al conectar a MySQL: ' + error.message);
  }
}

// Para MongoDB
async function testMongoDB() {
  const mongoose = require('mongoose');
  try {
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // En MongoDB, podemos listar las bases de datos (requiere usar el driver nativo), 
    // pero para este ejemplo, simplemente indicaremos que se conectó correctamente.
    const db = mongoose.connection;
    const readyState = db.readyState; // 1 = conectado
    await mongoose.disconnect();
    return { connected: readyState === 1 };
  } catch (error) {
    throw new Error('Error al conectar a MongoDB: ' + error.message);
  }
}

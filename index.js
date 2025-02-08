require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Configurar MariaDB/MySQL
const mysqlConn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

// Conectar a MariaDB
mysqlConn.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MariaDB:', err);
        return;
    }
    console.log('✅ Conectado a MariaDB');
});

// Configurar MongoDB
const mongoClient = new MongoClient(process.env.MONGO_URI);
let mongoDb;

mongoClient.connect()
    .then(client => {
        mongoDb = client.db(process.env.MONGO_DATABASE);
        console.log('✅ Conectado a MongoDB');
    })
    .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// 📌 Endpoint para obtener todas las centrales desde MariaDB
app.get('/centrals', (req, res) => {
    mysqlConn.query('SELECT * FROM CENTRALS', (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(results);
    });
});

// 📌 Endpoint para obtener todas las centrales desde MongoDB
app.get('/centrals/mongo', async (req, res) => {
    try {
        const centrals = await mongoDb.collection('CENTRALS').find().toArray();
        res.json(centrals);
    } catch (err) {
        res.status(500).send(err);
    }
});

// 📌 Endpoint para insertar una central en MariaDB
app.post('/centrals', (req, res) => {
    const { name_central, address_central, phone_central, email_central } = req.body;
    mysqlConn.query(
        'INSERT INTO CENTRALS (name_central, address_central, phone_central, email_central, CREATED_DATE, UPDATED_DATE) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [name_central, address_central, phone_central, email_central],
        (err, results) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json({ id: results.insertId, message: "Central añadida con éxito." });
        }
    );
});

// 📌 Endpoint para insertar una central en MongoDB
app.post('/centrals/mongo', async (req, res) => {
    try {
        const { name_central, address_central, phone_central, email_central } = req.body;
        const result = await mongoDb.collection('CENTRALS').insertOne({
            name_central,
            address_central,
            phone_central,
            email_central,
            CREATED_DATE: new Date(),
            UPDATED_DATE: new Date()
        });
        res.json({ id: result.insertedId, message: "Central añadida en MongoDB." });
    } catch (err) {
        res.status(500).send(err);
    }
});

// 📌 Servidor escuchando
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

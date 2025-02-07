from fastapi import FastAPI
import pymssql
import pymysql
from pymongo import MongoClient

app = FastAPI()

# Configurar SQL Server
sql_conn = pymssql.connect(server='localhost', user='sa', password='TuPasswordFuerte123!', database='master')

# Configurar MySQL
mysql_conn = pymysql.connect(host="localhost", user="root", password="TuPasswordFuerte123!", database="TuBaseDeDatos")

# Configurar MongoDB
mongo_client = MongoClient("mongodb://localhost:27017")
mongo_db = mongo_client["TuBaseNoSQL"]

@app.get("/")
def read_root():
    return {"message": "API REST funcionando en FastAPI"}

@app.get("/sqlserver")
def get_sqlserver_data():
    cursor = sql_conn.cursor()
    cursor.execute("SELECT TOP 1 * FROM TuTabla")
    result = cursor.fetchone()
    return {"data": result}

@app.get("/mysql")
def get_mysql_data():
    cursor = mysql_conn.cursor()
    cursor.execute("SELECT * FROM TuTabla LIMIT 1")
    result = cursor.fetchone()
    return {"data": result}

@app.get("/mongodb")
def get_mongodb_data():
    collection = mongo_db["TuColeccion"]
    result = collection.find_one()
    return {"data": result}


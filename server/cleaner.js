const DataBase=require("./utils/database");
require('dotenv').config();

const connectionInfo = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

const db = new DataBase();

db.createConnection(connectionInfo);


setInterval(function () {
//nothingYet
    
 }, 3600000);

const express=require("express");
const DataBase=require("./utils/database");
require('dotenv').config();

const router = express.Router();
const connectionInfo = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

const db = new DataBase();

db.createConnection(connectionInfo);

router.get("/", (req,res)=>
{
 res.send("Wrong Link");
}
)

router.get("/:token",(req,res)=>
{

   res.sendFile(__dirname+"/responses/emailverification.html");
    
} )


module.exports=router

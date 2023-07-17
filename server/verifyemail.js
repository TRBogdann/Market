
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

router.get("/:token",async (req,res)=>
{ 
    let query="SELECT * FROM requests_su WHERE token='"+req.params.token+"'";
    const user=await db.runQuery(query);

   if(user[0])
   {

   query="SELECT MAX(id) AS lastID FROM customers ";
   let result = await db.runQuery(query);

   let newID=0;
   
   if(result[0]) newID= result[0].lastID+1;

   let date=user[0].create_date;
   let dateStr =
    date.getFullYear() + "/" + date.getMonth() + "/" + date.getDay();

   let insertQuery="INSERT INTO customers VALUES(";
//4871010446475ef2849d3652b27619c262a31a43a222dbd13d676f761faf
   insertQuery+=
   newID+
   ',"'+
   user[0].first_name+
   '","'+
   user[0].surname+
   '","'+
   user[0].username+
   '","'+
   user[0].passHash+
   '","'+
   user[0].phone_number+
   '","'+
   dateStr+
   '","'+
   user[0].email+
   '")';

   result = await db.runQuery(insertQuery);
   
   const deleteQuery="DELETE FROM requests_su WHERE token='"+req.params.token+"'";

   result= await db.runQuery(deleteQuery);


   res.sendFile(__dirname+"/responses/emailverification.html");
   }

   else
   res.send("Invalid link or link expired");
    
} )


module.exports=router

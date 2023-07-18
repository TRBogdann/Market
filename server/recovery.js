//Unfinished

const express = require("express");
const DataBase = require("./utils/database");
const bodyParser = require("body-parser");
const multer = require("multer");
const formChecker = require("./utils/formchecker");
const cypher = require("./utils/cypher"); 
const sendMail = require("./utils/email");
require("dotenv").config();

const router = express.Router();
const connectionInfo = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

const db = new DataBase();

db.setText("RECOVER : ");
db.createConnection(connectionInfo);

const upload = multer();
router.use(bodyParser.json());
router.use(upload.none());

router.get("/change" , (req,res)=>
{
    res.send("Invalid Link");
})

router.get("/change/:token", async (req,res)=>
{
//Nothing Here Yet
})



router.post("/request" , async (req,res)=>
{
    const correct = formChecker.checkEmail(req.body);

    if(correct===1)
        {
            console.log("RECOVER : [ERROR: Data did not reach the server]");
            res.send("Data did not reach the server");
            return;
        }

    if(correct===2)
        {
            console.log("RECOVER : [WARNING: Invalid data reached the server] ");
            res.send("Invalid Email");
            return;
        }

    

    let result;

    
    const checkQuery="SELECT id FROM customers WHERE email='"+req.body.email+"'";

    try{
        result=await db.runQuery(checkQuery);
    }
    catch(error){
        console.log("RECOVER : [ERROR: ID couldn t be accessed]");
        console.log(error);

        res.send("Internal Server Error");
        
        return;
    }

    if(result===null || result===undefined)
    {
        res.send("Email was not found");
        return;
    }

    if(result[0]===null || result[0]===undefined)
    {
        res.send("Email was not found");
        return;
    }

    const checkRequest="SELECT token FROM requests_r WHERE email='"+req.body.email+"'";
    try{
        result=await db.runQuery(checkRequest);
    }
    catch(error){
        console.log("RECOVER : [ERROR: Requests couldn t be accessed]");
        console.log(error);

        res.send("Internal Server Error");

        return;
    }

    if(result[0])
    {   
        res.send("A request was already made. Check your Email");
        return;
    }

    let token = cypher.genToken(30);
    const date = new Date();
    const dateStr =
     date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
  
    let hour = date.getHours();
    const time = hour + ":" + date.getMinutes();

    let insertQuery="INSERT INTO requests_r VALUES('";

    insertQuery+=
    token+"','"+
    req.body.email+"','"+
    dateStr+"','"+
    time+"')";

    try{
        db.runQuery(insertQuery);
    }

    catch(error){
        console.log("RECOVER : [ERROR: Couldn t create request for "+req.body.email+"]");
        console.log(error);

        res.send("Internal Server Error");

        return;

    }

    

    const url=process.env.SERVER_URL+"recovery/change/"+token;
    sendMail(req.body.email,"Recover Your Password",url,"recovery");


    res.send("An email was sent to the adress");
});

module.exports=router;
//Unfinished

const express = require("express");
const DataBase = require("./utils/database");
const bodyParser = require("body-parser");
const multer = require("multer");
const formChecker = require("./utils/formchecker");
const cypher = require("./utils/cypher"); 
const encryptor = require("./utils/encryptor");
const sendMail = require("./utils/email");
require("dotenv").config();

const router = express.Router();
const connectionInfo = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

function checkPass(pass,cpass)
{

    if (pass === undefined) return 1;
    if (cpass === undefined) return 1;
    
    if (pass === "") return 1;
    if (cpass === "") return 1;


    if (pass.length > 200) return 2;

    if (pass !== cpass) return 2;
    if (pass.includes(" ")) return 2;


    return 0;
}

const db = new DataBase();

db.setText("RECOVER : ");
db.createConnection(connectionInfo);

const upload = multer();
router.use(bodyParser.json());
router.use(upload.none());

router.get("/change", async (req,res)=>
{
    const token=req.query.token;

    if(token===undefined || token===""){
    res.send("Invalid Link");
    return;
    }

    const query = "SELECT email FROM requests_r WHERE token='"+token+"'";
    let result;
    try{
     result = await db.runQuery(query); 
    }
    catch(error){
        console.log("RECOVER : [ERROR: Requests couldn t be accessed]");
        console.log(error);

        res.send("Internal Server Error");

        return;
    } 

    if(result[0])  
         res.sendFile(__dirname+"/responses/recover.html");
    else
        res.send("Invalid Request");
})

router.post("/change/:token", async (req,res)=>
{
    const checkQuery = "SELECT email FROM requests_r WHERE token='"+req.params.token+"'";
    let user;

    try{
        user = await db.runQuery(checkQuery);
    }
    catch(error){
        console.log("RECOVER : [ERROR: Requests couldn t be accessed]");
        console.log(error);

        res.send("Internal Server Error");

        return;
    }

    if(!user[0])
    {
        console.log("RECOVER: [ERROR: Invalid token reached the server]");
        res.send("Invalid Token");
        return;
    }

    const checkPassResponse = checkPass(req.body.pass,req.body.cpass);

    if(checkPassResponse===1)
    {
        console.log("RECOVER: [ERROR: Data did not reach the server]");
        res.send("Try Again");
        return;
    }

    if(checkPassResponse===2)
    {
        console.log("RECOVER: [ERROR: Invalid data reached the server]");
        res.send("Bad request");
        return;
    }

    const userQuery="SELECT username FROM customers WHERE email='"+user[0].email+"'";
    let username;

    try{
        username=await db.runQuery(userQuery);
    }
    catch(error)
    {
        console.log("RECOVER : [ERROR: Customers couldn t be accessed]");
        console.log(error);

        res.send("Internal Server Error");

        return;
    }

    if(!username[0])
    {
        console.log("RECOVER: [ERROR: Invalid Data reached the server]");
        res.send("Bad Request");
        return;
    }
    

    const logoutQuery="DELETE FROM session WHERE username='"+username[0].username+"'";
    
    try{
    db.runQuery(logoutQuery);
    }
    catch(error)
    {
        console.log("RECOVER : [ERROR: User couldn t be logged out]");
        console.log(error);

        res.send("Internal Server Error");

        return;
    }

    const hash =await encryptor.hashPassword(req.body.pass);
    const updateQuery = "UPDATE customers SET passHash='"+hash+"'"
    +" WHERE email='"+user[0].email+"'";

    try{
        db.runQuery(updateQuery);
    }
    catch(error)
    {
        console.log("RECOVER : [ERROR: Password couldn t be changed for "+user[0].email+"]");
        console.log(error);

        res.send("Internal Server Error");

        return;
    }

    const deleteQuery="DELETE FROM requests_r WHERE token='"+req.params.token+"'";

    try{
        db.runQuery(deleteQuery);
    }
    catch(error)
    {
        console.log("RECOVER : [ERROR: Password change request couldn t be deleted /"+user[0].email+"]");
        console.log(error);

        res.send("Password changed");

        return;
    }

    res.send("Password Changed");
});






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

    

    const url=process.env.SERVER_URL+"recovery/change?token="+token;
    sendMail(req.body.email,"Recover Your Password",url,"recovery");


    res.send("An email was sent to the adress");
});

module.exports=router;
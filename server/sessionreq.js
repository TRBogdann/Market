
const express=require("express");
const bodyParser=require("body-parser");
const multer=require("multer");
const DataBase=require("./utils/database");


const router = express.Router();
const connectionInfo = {
    host: "",
    user: "",
    password: "",
    database: "",
  };

const db = new DataBase();
db.createConnection(connectionInfo);

router.use(express.urlencoded({ extended: false }));
const upload = multer();
router.use(bodyParser.json());
router.use(upload.none());


router.post("/" , async (req,res)=>
{

if(req.body.id===undefined || req.body.id===undefined)
    {   
        res.send("Bad request");
        return;
    }

const query="SELECT username FROM session WHERE id='"+req.body.id+"'";
const result= await db.runQuery(query);
if(result)
{    
    if(result[0]===undefined || result[0]===null)
    {
        res.send("Bad request");
        return
    }
    res.send(result[0].username);
}

});


module.exports=router;

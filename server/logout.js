const express = require("express");
const DataBase = require("./utils/database");
const multer = require("multer");
const bodyParser = require("body-parser");

const router = express.Router();

const connectionInfo = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

const db = new DataBase();

db.setText("LOGOUTSCRIPT :");
db.createConnection(connectionInfo);

const upload = multer();
router.use(bodyParser.json());
router.use(upload.none());

router.post("/", async (req, res) => {
  const query = "DELETE FROM session WHERE id='" + req.body.id + "'";

  try{
  db.runQuery(query);
  }
  catch(error)
  {
    console.log("LOGOUTSCRIPT : [User couldn t be logged out]");
    console.log("LOGOUTSCRIPT : [Session token: ",req.body.id+"]");
    console.log(error);
    
    res.sendStatus(500);
    
    return;
  }

  res.sendStatus(200);
});

module.exports = router;

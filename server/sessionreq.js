const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const DataBase = require("./utils/database");
require("dotenv").config();

const router = express.Router();
const connectionInfo = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

const db = new DataBase();
db.setText("SESSION : ");
db.createConnection(connectionInfo);

router.use(express.urlencoded({ extended: false }));
const upload = multer();
router.use(bodyParser.json());
router.use(upload.none());

router.post("/", async (req, res) => {
  if (req.body.id === undefined || req.body.id === undefined) {
    res.send("Bad request");
    return;
  }

  const query = "SELECT username FROM session WHERE id='" + req.body.id + "'";

  try{
  const result = await db.runQuery(query);

  if (result) {
    if (result[0] === undefined || result[0] === null) {
      res.send("Bad request");
      return;
    }

    res.send(result[0].username);
  }

}
catch(error){

  console.log("SESSION : [ERROR: Data for session "+req.body.id+" could not be accesed");
  console.log(error);
  res.send(500);
}

});

module.exports = router;

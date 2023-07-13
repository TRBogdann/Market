const DataBase = require("./utils/database");
const formChecker = require("./utils/formchecker");
const express = require("express");
const encryptor = require("./utils/encryptor");
const bodyParser = require("body-parser");
const multer = require("multer");


const router = express.Router();
const db = new DataBase();
const connectionInfo = {
  host: "",
  user: "",
  password: "",
  database: "",
};

db.createConnection(connectionInfo);

const upload = multer();
router.use(bodyParser.json());
router.use(upload.none());

router.get("/", (req, res) => {
  res.send("Server is working");
});

router.post("/", async (req, res) => {
  let ok = formChecker.checkForm(req.body);

  if (ok === 1) {
    res.send("Data didn t reach the server");
    return;
  }

  if (ok === 2) {
    res.send("Invalid Data reached the server");
    return;
  }

  let queryCode = 0;

  const query = "SELECT id, username FROM customers";
  let result = await db.runQuery(query);
  let id = 0;
  
  for (let i = 0; i < result.length; i++) {
    if (result[i].id > id) id = result[i].id + 1;
    if (result[i].username === req.body.uname) {
      queryCode = 1;
      break;
    }
  }

  if (queryCode) {
    res.send("Username exists");
    return;
  }

  let newID = id;
  let hash = await encryptor.hashPassword(req.body.pass);
  let date = new Date();
  let dateStr =
    date.getFullYear() + "/" + date.getMonth() + "/" + date.getDay();

  let insertQuery = "INSERT INTO customers VALUES(";

  insertQuery +=
    newID +
    ',"' +
    req.body.fname +
    '","' +
    req.body.sname +
    '","' +
    req.body.uname +
    '","';

  insertQuery +=
    hash +
    '","' +
    req.body.phone +
    '","' +
    dateStr +
    '","' +
    req.body.email +
    '")';

  result = await db.runQuery(insertQuery);

  res.send("Sign Up Succesfully");
});

module.exports = router;

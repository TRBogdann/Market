const DataBase = require("./utils/database");
const cypher = require("./utils/cypher");
const formChecker = require("./utils/formchecker");
const sendEmail = require("./utils/email");
const express = require("express");
const encryptor = require("./utils/encryptor");
const bodyParser = require("body-parser");
const multer = require("multer");
require("dotenv").config();

const router = express.Router();
const db = new DataBase();
const connectionInfo = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

db.setText("SUSCRIPT : ");
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

  let query = "SELECT id, username,email FROM customers";
  let result = await db.runQuery(query);

  for (let i = 0; i < result.length; i++) {
    if (
      result[i].username === req.body.uname ||
      result[i].email === req.body.email
    ) {
      queryCode = 1;
      break;
    }
  }

  if (queryCode) {
    res.send("Username or Email already exists");
    return;
  }

  query = "SELECT username,email FROM requests_su";
  result = await db.runQuery(query);

  for (let i = 0; i < result.length; i++) {
    if (
      result[i].username === req.body.uname ||
      result[i].email === req.body.email
    ) {
      queryCode = 1;
      break;
    }
  }

  if (queryCode) {
    res.send("Email was not validated");
    return;
  }

  let hash = await encryptor.hashPassword(req.body.pass);
  let token = cypher.genToken(30);
  const date = new Date();
  const dateStr =
    date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();

  let hour = 0;
  if (date.getHours() !== 23) hour = date.getHours() + 1;

  const expire = hour + ":" + date.getMinutes();

  let insertQuery = "INSERT INTO requests_su VALUES(";

  insertQuery +=
    '"' +
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
    '","' +
    token +
    '","' +
    expire +
    '")';

  result = await db.runQuery(insertQuery);

  const url = process.env.BASE_URL + token;
  sendEmail(req.body.email, "Validate Your Email", url);

  res.send("Validate Email");
});

module.exports = router;

const DataBase = require("./utils/database");
const express = require("express");
const encryptor = require("./utils/encryptor");
const bodyParser = require("body-parser");
const multer = require("multer");
const formChecker = require("./utils/formchecker");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const router = express.Router();
const connectionInfo = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

const db = new DataBase();

db.setText("LOGINSCRIPT : ");
db.createConnection(connectionInfo);

const upload = multer();
router.use(bodyParser.json());
router.use(upload.none());
router.use(cookieParser());

router.use(
  session({
    secret: "Yes",
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: false,
  })
);

router.get("/", (req, res) => {
  res.send("Server is working");
});

router.post("/", async (req, res) => {
  let type = formChecker.checkLoginForm(req.body);

  if (type === 1) {
    console.log("LOGINSCRIPT : [WARNING: Data did not reach the server]");
    res.send({
      text: "Unexpected problem happened.Please try again",
      status: 406,
    });
    return;
  }
  if (type === 2) {
    console.log("LOGINSCRIPT : [WARNING: Invalid data reached the server]");
    res.send({ text: "User or password are invalid", status: 400 });
    return;
  }

  let query = "SELECT passhash," + type + " FROM customers";
  let result;
  try{
    result = await db.runQuery(query);
  }
  catch(error)
  {
    console.log("LOGINSCRIPT : [ERROR: Hash could not be accesed]");
    console.log(error);

    const failMessage=
    {
      text:"Internal Server Error.Try Again Later",
      status:500
    }

    res.send(failMessage);

    return;

  }

  let hash = "";

  let found = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i][type] === req.body.user) {
      found = 1;
      hash = result[i].passhash;
      break;
    }
  }

  if (!found) {
    res.send({ text: "Password or " + type + " incorrect", status: 400 });
    return;
  }

  let correct = await encryptor.checkPassword(req.body.password, hash);

  if (!correct) {
    res.send({ text: "Password or " + type + " incorrect", status: 400 });
    return;
  }

  req.session.auth = true;
  req.session.user = req.body.user;

  query =
    "SELECT id,username FROM customers WHERE " +
    type +
    "='" +
    req.body.user +
    "'";

  let userID;

  try{
    userID = await db.runQuery(query);
  }
  catch(error)
  {
    console.log("LOGINSCRIPT : [ERROR: UserID could not be accesed]");
    console.log(error);

    const failMessage=
    {
      text:"Internal Server Error.Try Again Later",
      status:500
    }

    res.send(failMessage);

    return;

  }



  const date = new Date();
  const dateStr =
    date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();

  query =
    'INSERT INTO session VALUES("' +
    req.sessionID +
    '","' +
    req.socket.remoteAddress +
    '","' +
    userID[0].username +
    '",' +
    userID[0].id +
    ',"' +
    dateStr +
    '");';

  try{
  db.runQuery(query);
  }
  catch(error)
  {
  console.log("LOGINSCRIPT: [ERROR: Session for "+userID[0].username+" could not be generated");
  console.log(error);

  const failMessage=
    {
      text:"Internal Server Error.Try Again Later",
      status:500
    }

    res.send(failMessage);

    return;

  }

  const rev = {
    name: "sessionID",
    value: req.sessionID,
    text: "Loged In",
    status: 200,
  };

  res.send(rev);
});

module.exports = router;

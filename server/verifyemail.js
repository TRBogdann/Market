const express = require("express");
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

db.setText("VERIFYEMAIL : ");
db.createConnection(connectionInfo);

router.get("/", (req, res) => {
  res.send("Wrong Link");
});

router.get("/:token", async (req, res) => {
  let query =
    "SELECT * FROM requests_su WHERE token='" + req.params.token + "'";

  let user;
  try{
    user = await db.runQuery(query);
  }
  catch(error)
  {
    console.log("VERIFYEMAIL: [ERROR: Requests couldn t be accesed]");
    console.log(error);

    res.send("Internal Server Error");

    return;
  }

  if (user[0]) {
    query = "SELECT MAX(id) AS lastID FROM customers ";

    let result;

    try{
      result = await db.runQuery(query);
    }
    catch(error)
    {
      console.log("VERIFYEMAIL : [ERROR: Table customers could not be accesed]");
      console.log(error);

      res.send("Internal Server Error");

      return;
    }

    let newID = 0;

    if (result[0]) newID = result[0].lastID + 1;

    const date = user[0].create_date;
    const dateStr =
      date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();

    let insertQuery = "INSERT INTO customers VALUES(";

    insertQuery +=
      newID +
      ',"' +
      user[0].first_name +
      '","' +
      user[0].surname +
      '","' +
      user[0].username +
      '","' +
      user[0].passHash +
      '","' +
      user[0].phone_number +
      '","' +
      dateStr +
      '","' +
      user[0].email +
      '")';

    try{
    result = await db.runQuery(insertQuery);
    }
    catch(error)
    {
      console.log("VERIFYEMAIL : [ERROR: User "+user[0].username+" could not be created]");
      console.log(error);

      res.send("Internal Server Problem");

      return;
    }

    const deleteQuery =
      "DELETE FROM requests_su WHERE token='" + req.params.token + "'";

    try{
    result = await db.runQuery(deleteQuery);
    }
    catch(error)
    {
      console.log("VERIFYEMAIL : [ERROR:Reuquest for User "+user[0].username+" could not be deleted]");
      console.log(error);

      res.sendFile(__dirname + "/responses/emailverification.html");

      return;
    }

    res.sendFile(__dirname + "/responses/emailverification.html");
  } else res.send("Invalid link or link expired");
});

module.exports = router;

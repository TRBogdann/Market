const DataBase = require("./utils/database");
require("dotenv").config();

const connectionInfo = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

const db = new DataBase();

db.setText("CLEANER : ");
db.createConnection(connectionInfo);

function dateDiff(date1, date2) {
  return date1 - date2;
}

setInterval(async () => {
  let countSession = 0;
  let countRequest = 0;
  const date = new Date();

  const query1 = "SELECT creation,id FROM session";
  let result = await db.runQuery(query1);

  if (result[0]) {
    for (let i = 0; i < result.length; i++) {
      if (dateDiff(date, result[i].creation) > 2592000000) {
        const deleteQuery =
          'DELETE FROM session WHERE id="' + result[i].id + '"';
        db.runQuery(deleteQuery);
        countSession++;
      }
    }
  }

  const query2 = "SELECT username,create_date,expire FROM requests_su";
  result = await db.runQuery(query2);

  if (result[0]) {
    for (let i = 0; i < result.length; i++) {
      const dateInfo = result[0].create_date;
      const time = result[0].expire;
      const dateStr =
        dateInfo.getFullYear() +
        "/" +
        (dateInfo.getMonth() + 1) +
        "/" +
        dateInfo.getDate() +
        " " +
        time;
      const date2 = new Date(dateStr);

      if (dateDiff(date, date2) > 3600000) {
        const deleteQuery =
          'DELETE FROM requests_su WHERE username="' + result[i].username + '"';
        db.runQuery(deleteQuery);
        countRequest++;
      }
    }
  }

  console.log("CLEANER : [" + countSession + " Sessions Deleted]");
  console.log("CLEANER : [" + countRequest + " Sessions Deleted]");
}, 3600000);

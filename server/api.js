
const indexRouter=require("./index.js");
const loginRouter=require("./loginscript.js");
const signupRouter=require("./signup.js");
const sessionRouter=require("./sessionreq.js");
const logoutRouter=require("./logout.js");
const emailRouter=require("./verifyemail.js");
const recoveryRouter=require("./recovery.js")

const cors = require("cors");
const express=require("express");

const app=express();

app.use(cors());

app.use("/",indexRouter);
app.use("/checklogin",loginRouter);
app.use("/checksignup",signupRouter);
app.use("/sessioninfo",sessionRouter);
app.use("/logout",logoutRouter);
app.use("/verifyEmail",emailRouter);
app.use("/recovery",recoveryRouter);

app.listen(9000);

const indexRouter=require("./index.js");
const loginRouter=require("./loginscript.js");
const signupRouter=require("./signup.js");
const sessionRouter=require("./sessionreq.js");
const logoutRouter=require("./logout.js");

const cors = require("cors");
const express=require("express");

const app=express();

app.use(cors());

app.use("/",indexRouter);
app.use("/checklogin",loginRouter);
app.use("/checksignup",signupRouter);
app.use("/sessioninfo",sessionRouter);
app.use("/logout",logoutRouter);

app.listen(9000);

const cypher = (function () {
    const crypto=require("crypto");

    function generateToken(size)
    {
        const token=crypto.randomBytes(size).toString("hex");
        return token;
    }
 
     return {
        genToken:generateToken,
     };
   })();

module.exports=cypher; 
 
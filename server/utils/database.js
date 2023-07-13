
class DataBase
{

#mysql=require('mysql');
#connection;


createConnection(ConnectionData){
    this.#connection=this.#mysql.createConnection(ConnectionData);
    this.#connection.connect((err)=>
 {  
    if(err) throw err;
    console.log("Connected to DataBase");
 }
 )
}

  runQuery(query){
    return new Promise((resolve,reject) => {
        this.#connection.query(query, (err,result)=>
        {
            if(err) reject(err);
            resolve(result);
        }
        )
    }
    )
}

}

module.exports=DataBase;

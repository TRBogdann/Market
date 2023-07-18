import React,{useState} from "react";

function Recover()
{
    const [email,setEmail]=useState("");
    const [message,setMessage]=useState("");

    const HandleRequest = (e)=> {

        e.preventDefault();
        setMessage("");

        if(email===""){
            setMessage("Email cannot be left empty");
            return;
        }

        const form=new FormData();

        form.append("email",email);

        const request=new XMLHttpRequest();
        request.open("POST","http://localhost:9000/recovery/request");

        request.onload = ()=>
        {
            setMessage(request.responseText);
        }

        request.send(form);

        }
    

    return(
        <>
        <h1>Recover Password</h1>
        <form onSubmit={(e)=>{HandleRequest(e)}}>
        <label>
        Email:<br/>
        <input type="email" name="email" onChange={(e)=>{setEmail(e.target.value)}} />
      </label>
      <input type="Submit" value="Send Recovery Email"/>
        </form>
        <div>{message}</div>
        </>
    )
}

export default Recover;
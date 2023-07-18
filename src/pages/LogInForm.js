import "./login.css"
import React,{useState} from "react";
import {useCookies} from "react-cookie";

function LogInForm()
{
  const [user,setUser]=useState("");
  const [password,setPassword]=useState("");
  const [message,setMessage]=useState("");
  const [cookies, setCookie] = useCookies(['sessionID']);


 const HandleRequest= async (e) =>
  {
    e.preventDefault();
    const request=new XMLHttpRequest();

    const fdata=new FormData();
    setMessage("");

    if(password==="" || user==="")
    {
      setMessage("Password and User cannot be left empty");
      return;
    }

    fdata.append("password",password);
    fdata.append("user",user);
  
    
    request.open("POST","http://localhost:9000/checklogin");
    request.onload= () =>
    { 
      const res=JSON.parse(request.response);
      if(res.status===200){
      setCookie(res.name,res.value);
      window.location.pathname="/";
      }
      setMessage(res.text);
    };
    request.send(fdata);
    
  }


 return (
      <>
      <form onSubmit={(e)=>{HandleRequest(e)}}>
      <label>Username or Email:</label>
      <input type="text" className="username" onChange={(e)=>{setUser(e.target.value)}} /> 
        <label>Password:</label>
        <input type="password" className="password" onChange={(e)=>{setPassword(e.target.value)}} /> 
        <input type="submit" value="Log In"/>
      </form>
      <a href="/recovery">Forgot Password</a>
      <div className="errorMessage">{message}</div>
      </>
    );
}
 export default LogInForm;
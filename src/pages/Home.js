import "./home.css"
import React,{useState} from "react";
import Cookies from "js-cookie";

function Home()
{
    const [userData,setUserData]=useState(Cookies.get("sessionID"));
    const [user,setUser]=useState("No User");

    const logOut = async (e)=>
    {   
        

        console.log("started");
        const request= new XMLHttpRequest();
        const fdata= new FormData();
        fdata.append("id",userData);
        
        request.open("POST","http://localhost:9000/logout");

        request.onload=()=>
        {
            if(request.responseText==="OK")
            {
                console.log("deleted");
                Cookies.remove("sessionID");
            }
            window.location.reload();
        }
        request.send(fdata);
    }

    async function getUser()
    {

        if(userData===undefined || userData===null)return;

        const request=new XMLHttpRequest();
        const fdata= new FormData();
        fdata.append("id",userData);

        request.open("POST","http://localhost:9000/sessioninfo");

        request.onload= () =>
        {
            setUser(request.responseText);
        }

        request.send(fdata);


    };

    getUser();
    return(
    <>
    
    
    {!userData ?
    <>
    <h1>No Session Found</h1>
    <div className="bt1">
    <a href="/login"> Log In</a>
    <a href="/signup">Sign Up</a>
    </div>
    </>
    :
    <>
   <h1>Hello {user}</h1>
   <button onClick={(e)=>{logOut(e)}}>Log out</button>
   </>
    }
    </>
    );

}

export default Home;
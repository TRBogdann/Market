
import './signup.css';
import React,{useState} from 'react';

function SignUpForm()
{

    const [isValid,setIsValid]=useState(0);
    const [fdata,setFdata]=useState(
        {
    uname:"",
    fname:"",
    sname:"",
    pass:"",
    cpass:"",
    phone:"",
    email:"",
    cemail:"" 
        }
    )
    const  [message,setMessage]=useState(
    {
            uname:"",
            fname:"",
            sname:"",
            pass:"",
            cpass:"",
            phone:"",
            email:"",
            cemail:"" 
                
    })

    const mailValidator=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  

    function checkForm()
    {   
        setIsValid(1);
        const obj=  {
            uname:"",   
            fname:"",
            sname:"",
            pass:"",
            cpass:"",
            phone:"",
            email:"",
            cemail:"" 
                
    };

    setMessage(obj);

        for (const [key, value] of Object.entries(fdata)) {
            if(value==="")setIsValid(0);
        }

        if(fdata.fname.length>80)
        {
            setIsValid(0);
            obj["fname"]="First Name cannot be longer than 80 characters \n";
            setMessage(obj);
        }

        if(fdata.sname.length>40)
        {
            setIsValid(0);
            obj["sname"]="Surname cannot be longer than 40 characters \n";
            setMessage(obj);
        }

        if(fdata.uname.length>64)
        {
            setIsValid(0);
            obj["uname"]="Username cannot be longer than 64 characters \n";
            setMessage(obj);
        }

        if(fdata.email.length>80)
        {
            setIsValid(0);
            obj["email"]="Email cannot be longer than 80 characters \n";
            setMessage(obj);
        }

        if(fdata.phone.length>18)
        {
            setIsValid(0);
            obj["phone"]="Phone cannot be longer than 18 characters \n";
            setMessage(obj);
        }

        if(fdata.pass.length>200)
        {
            setIsValid(0);
            obj["pass"]="Password cannot be longer than 200 characters \n";
            setMessage(obj);
        }

        
        if(fdata.fname!=="" && !/^[a-z A-Z]+$/.test(fdata.fname))
        {
            setIsValid(0);
            obj["fname"]="Name cannot contain numbers or special characters \n";
            setMessage(obj);
        }

        if(fdata.sname!=="" && !/^[a-z A-Z]+$/.test(fdata.sname))
        {
            setIsValid(0);
            obj["sname"]+="Name cannot contain numbers or special characters \n";
            setMessage(obj);
        }

        if(fdata.sname[0]===' ')
        {
            setIsValid(0);
            obj["sname"]+="Name cannot start with ' ' \n";
            setMessage(obj);
        }

        if(fdata.fname[0]===' ')
        {
            setIsValid(0);
            obj["sname"]+="Name cannot start with ' ' \n";
            setMessage(obj);
        }

        if(fdata.phone!=="" && !/^[0-9]+$/.test(fdata.phone))
        {
            setIsValid(0);
            obj["phone"]+="Invalid phone number \n";
            setMessage(obj);
        }

        if(fdata.uname!=="" && !/^[a-zA-Z.0-9]+$/.test(fdata.uname))
        {
            setIsValid(0);
            obj["uname"]+="Username can only contain letters (a-z A-Z), numbers(0-9) and . \n";
            setMessage(obj);
        }

        if(fdata.pass!=="" && fdata.pass.includes(" "))
        {
            setIsValid(0);
            obj["pass"]+="Password cannot contain ' ' \n";
            setMessage(obj);
        }

        if(fdata.pass!=="" && fdata.pass.length<8)
        {
            setIsValid(0);
            obj["pass"]+="Password should be at least 8 characters \n";
            setMessage(obj);
        }

        if(fdata.email!=="" && (!mailValidator.test(fdata.email)))
        {
            setIsValid(0);
            obj["email"]+="Invalid email \n";
            setMessage(obj); 
        }

            if(fdata.pass!=="" && fdata.cpass!=="" && fdata.pass!==fdata.cpass )
        {
            setIsValid(0);;
            obj["cpass"]+="Passwords don t match \n";
            setMessage(obj);
        }

        
        if(fdata.email!=="" && fdata.cemail!=="" && fdata.email!==fdata.cemail )
        {
            setIsValid(0);
            obj["cemail"]+="Emails don t match \n";
            setMessage(obj);
        }
    
    }

    function updateColor(field)
    {
        if(field==="cpass" && (fdata.pass==="" || message.pass!==""))return "";
        if(field==="cemail" && (fdata.email==="" || message.email!==""))return "";

        if(fdata[field]==="")return "";
        if(message[field]==="")return "green";
        return "red";
    }

    function updateForm(field,e)
    {
        let obj=fdata;
        obj[field]=e.target.value;
        setFdata(obj);
        checkForm();
    }

    function sendForm(e)
    {  
         e.preventDefault();
        if(!isValid) return;

        const formData= new FormData();
        for (const [key, value] of Object.entries(fdata)) {
            formData.append(key,value);
        }

        const request=new XMLHttpRequest();

        request.open("POST","http://localhost:9000/checksignup"   );

        request.onload=function ()
    {
      console.log(request.responseText);
      
    }

    request.send(formData);

    }

    return (
    <div className="container">
    <form  onSubmit={(e)=>{sendForm(e)}}>
    <label>
    First Name:<br/>
    <input type="text" name="fname" onChange= {(e)=>{updateForm("fname",e)}}  style={{borderColor:updateColor("fname")}}/>
    </label>
    <div className="mess">{message.fname}</div>
    <label>
    Surname:<br/>
    <input type="text" name="sname" onChange= {(e)=>{updateForm("sname",e)}} style={{borderColor:updateColor("sname")}}  />
    </label>
    <div className="mess">{message.sname}</div>
    <label>
    Username:<br/>
    <input type="text" name="username"  onChange= {(e)=>{updateForm("uname",e)}} style={{borderColor:updateColor("uname")}}/>
    </label>
    <div className="mess">{message.uname}</div>
    <label>
    Email:<br/>
    <input type="email" name="email"  onChange= {(e)=>{updateForm("email",e)}} style={{borderColor:updateColor("email")}}/>
    </label>
    <div className="mess">{message.email}</div>
    <label>
    Confirm Email:<br/>
    <input type="email" name="cemail" onChange= {(e)=>{updateForm("cemail",e)}} style={{borderColor:updateColor("cemail")}}/>
    </label>
    <div className="mess">{message.cemail}</div>
    <label>
    Phone Number:<br/>
    <input type="tel" name="phone" onChange= {(e)=>{updateForm("phone",e)}} style={{borderColor:updateColor("phone")}}/>
    </label>
    <div className="mess">{message.phone}</div>
    <label>
    Password:<br/>
    <input type="password" name="pass" onChange= {(e)=>{updateForm("pass",e)}} style={{borderColor:updateColor("pass")}}/>
    </label>
    <div className="mess">{message.pass}</div>
    <label>
    Confirm Password{isValid}:<br/>
    <input type="password" name="cpass" onChange= {(e)=>{updateForm("cpass",e)}} style={{borderColor:updateColor("cpass")}} />
    </label>
    <div className="mess" >{message.cpass}</div>
    <input type="submit" value="Sign Up"/>
    </form>
    </div>
    );
}

export default SignUpForm;
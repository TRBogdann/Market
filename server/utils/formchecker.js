 
const formchecker = (function () {


function check(form)
{   
    if(form===undefined || form===null)return;
  
    const mailValidator=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    for (const [key, value] of Object.entries(form)) {
        if(value==="")return 1
    }

    if(form.fname.length>80)return 2;
    if(form.sname.length>40)return 2;
    if(form.uname.length>64)return 2;
    if(form.pass.length>200)return 2;
    if(form.email.length>80)return 2;
    if(form.phone.length>18)return 2;

    if(form.pass!==form.cpass)return 2;
    if(form.email!==form.cemail)return 2;

    if(form.fname[0]===" ")return 2;
    if(form.sname[0]===" ")return 2;
    if(form.pass.includes(" "))return 2;

    if(!/^[a-z A-Z]+$/.test(form.fname))return 2;
    if(!/^[a-z A-Z]+$/.test(form.sname))return 2;
    if(!/^[0-9]+$/.test(form.phone))return 2;
    if(!/^[a-zA-Z.0-9]+$/.test(form.uname))return 2;
    if(!mailValidator.test(form.email))return 2;


    return 0;
};

function checkLogin(form)
{   
    if(form===undefined || form===null)return;

    const mailValidator=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    let type="email";

    if(form.user==="")return 1;
    if(form.password==="")return 1;

    if(form.user.length>80)return 2;
    if(form.password.length>200)return 2;
    if(form.password.includes(" "))return 2;

    if(!mailValidator.test(form.user))
    {
        if(!/^[a-zA-Z.0-9]+$/.test(form.user)) return 2;
        else type="username";
    }

    if(form.user.length>64 && type==="username")return 2;

    return type;

};
 
     return {
        checkForm:check,
        checkLoginForm:checkLogin,
     };
   })();
 
 

module.exports=formchecker;
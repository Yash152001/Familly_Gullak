import React, { useRef } from 'react'
import { useState  } from 'react';
import { useHistory  } from 'react-router-dom';

function Login() {
    const [show, setShow] = useState(false)

    const [credentials, setCredentials] = useState({ email: "", password: "", forgotemail: "", newpassword :"" , otp:""})
    let history = useHistory();
    const [isloadingotp, setIsloadingotp] = useState(false)
    const [isloading, setIsloading] = useState(false)
    const [sendotpbuttonloading, setSendotpbuttonloading] = useState(false)
    const [forgotsubmitbuttonloadig, setforgotsubmitbuttonloadig] = useState(false)
    const [openpasswordfield, setopenpasswordfield] = useState(false)

     

    const handlesubmit = async (e) => {
        e.preventDefault();
        // api call
        setIsloading(true)
    const response = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: credentials.email,
          password: credentials.password,
          otp:credentials.otp ,
        }), // body data type must match "Content-Type" header
      }
    );
    const json =  await response.json(); 
    // console.log(json)
    if(json.success){
        localStorage.setItem("token" , json.token)
        history.push('/')
        setIsloading(false)
        window.location.reload();
       
    }
    else{
        alert("Invalid Credentails")
        setIsloading(false)
        }
    }
    const handlechange = (e) => {
        setCredentials({...credentials , [e.target.name] : e.target.value})

    }
    const handleShow = () => {
        setShow(!show)
    }

    // forgot password api
    const forgotpasswordmodal = useRef()
    const refclosemodal = useRef()

    const handleopenmodal = () => {
        forgotpasswordmodal.current.click()
    }


    const handleotpsend = async () => {
        setopenpasswordfield(true)
        setSendotpbuttonloading(true)
        const response = await fetch("http://localhost:5000/api/auth/sendotp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credentials.forgotemail }),
        });
        const data = await response.json();
        console.log(data);
        if (data.success) {
            setSendotpbuttonloading(false)
        } else {
            alert("Invaild Email ID");
            setSendotpbuttonloading(false)

        }
    };
 const openotpmodal = useRef()
  const closeotpmodal = useRef()
  const handleSendOTP = async () => {
    openotpmodal.current.click();
    setIsloadingotp(true)
    const response = await fetch("http://localhost:5000/api/auth/sendotp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: credentials.email }),
    });
    const data = await response.json();
    console.log(data);
    if (data.success) {
      setIsloadingotp(false)
    } else {
      alert("Invaild Email ID");
      setIsloadingotp(false)
    }
  };

  // for resend otp button 
   
  const handleReSendOTP = async () => {
    // openotpmodal.current.click();
    setIsloadingotp(true)
    const response = await fetch("http://localhost:5000/api/auth/sendotp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: credentials.email }),
    });
    const data = await response.json();
    console.log(data);
    if (data.success) {
      setIsloadingotp(false)
    } else {
      alert("Invaild Email ID");
      setIsloadingotp(false)
    }
  };


    const handleforgotpassword = async () => {
        setforgotsubmitbuttonloadig(true)
        const response = await fetch("http://localhost:5000/api/auth/forgotpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: credentials.forgotemail,
                newpassword: credentials.newpassword,
                otp: credentials.otp
            }),
        });
        await response.json();
        setforgotsubmitbuttonloadig(false) 
        refclosemodal.current.click()
        alert("Password Reset Successfully Please Login...")
    }



    return (
      <div className='container mt-5'>
      <div className='container my-3 border border-dark rounded-3 p-3 login-sizing'  >
              <form >
                  <div className="mb-3">
                      <label htmlFor="exampleInputEmail1" className="form-label" >Email address</label>
                      <input type="email" name="email" className="form-control" id="exampleInputEmail1" style={{width:"97%"}} aria-describedby="emailHelp" onChange={handlechange} />
                      <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>   
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>          
            <div class="input-group flex-nowrap mb-3" style={{width:"100%"}}>
              <input type={show ? "text" : "password"} class="form-control" id="exampleInputPassword1" name='password' aria-label="password input" onChange={handlechange} aria-describedby="password-input"/>
              <span class="input-group-text" id="password-input" onClick={handleShow}>{show ? "Hide" : "Show"}</span>
            </div>
           
            {/* code */}
            <br />
              </form>
            <button 
              disabled={credentials.email.length < 8 || credentials.password.length < 5 }
              className="btn btn-primary"
              onClick={handleSendOTP}>
            Send OTP   
            </button>
        </div>
        
  
  
  
        {/* modal for otp field */}
  
   
        <button type="button" ref={openotpmodal} class="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModalotp">
          Launch demo modal
        </button>
  
        <div class="modal fade" id="exampleModalotp" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">OTP Verification</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
  
                <div className="mb-3">
                  
                  {isloadingotp ? (<div style={{ display: 'flex', flexDirection:"column" ,justifyContent: 'center', alignItems: 'center' }}>
                    <p>Sending OTP to <b style={{color:"green"}}>{credentials.email}</b></p><div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div> ):( <div>
                      <p>OTP Send Successfully to <b style={{ color: "green" }}>{credentials.email}</b></p>
                  </div>) }
                  <label htmlFor="exampleInputusername" className="form-label" >Enter OTP</label>
                <input
                  type="number"
                  name="otp"
                  placeholder="OTP"
                  value={credentials.otp}
                  onChange={handlechange}
                  className="form-control" id="otp" aria-describedby="otphelp"
                  />
                  <p style={{color:"gray"}}>Haven't Recieved OTP Try Again</p>
                  <p className='btn btn-primary' onClick={handleReSendOTP}>Resend</p>
                </div>
  
  
                {/* code for otp field */}
              </div>
              <div class="modal-footer">
                <button type="button" ref={closeotpmodal} class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button onClick={handlesubmit} type="submit" disabled={isloading || credentials.otp.length < 6} className="btn btn-primary">{isloading ? <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div> : "Login"}</button>
              </div>
            </div>
          </div>
        </div>
        </div>
    )
  }
  
export default Login

import React, { useRef } from 'react'
import { useState  } from 'react';
import { useHistory  } from 'react-router-dom';


function Signup() {
  const [show, setShow] = useState(false)
  const [isloading, setIsloading] = useState(false)
  const [isloadingotp, setIsloadingotp] = useState(false)
  const [isloadingimg, setIsloadingimg] = useState(false)
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", profile: "" , familycode:"" ,role:"user",  otp: "" })
  const [isAdmin, setIsAdmin] = useState(false);


  let history  = useHistory();


  const handleRoleChange = (e) => {
    setIsAdmin(e.target.checked);
    setCredentials({ ...credentials, role: e.target.checked ? "admin" : "user" });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    // api call
    setIsloading(true)
const response = await fetch(
  "http://localhost:5000/api/auth/createuser",
  {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      profile:localStorage.getItem("profile"),
      familycode: credentials.familycode,
      role: credentials.role,
      otp:credentials.otp 
    }),
  }
  );
  const json =  await response.json(); 
  console.log(json);// body data type must match "Content-Type" header
if(json.success){
    localStorage.setItem("token" , json.token)
  history.push('/')
  setIsloading(false)
  // closeotpmodal.current.click();
  window.location.reload();
    }
else {
  alert('Invalid OTP')
  setIsloading(false)

    }


    // handle change function

  } 
  const handlechange = (e) => {
    setCredentials({...credentials , [e.target.name] : e.target.value})

  }

  // show hide button
  const handleShow = () => {
    setShow(!show)
  
  }



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


  // images upload for profile
  const postDetails = (pics) => {
    if (pics === undefined) {
      alert("end in first if condition");
      return;
    }
    setIsloadingimg(true)
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg" || pics.type === "image/WebP") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "mydrive");
      data.append("cloud_name", "dgmkwv786");
      fetch("https://api.cloudinary.com/v1_1/dgmkwv786/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.url.toString());
          localStorage.setItem("profile", data.url.toString())
          setIsloadingimg(false)
        })
        .catch((err) => {
          console.log(err);
          setIsloadingimg(false)
        });
    } else {
      setIsloadingimg(false)
      return;
    }
  };


  return (
   <>
   <div className='container'>
    <div className='container my-3 border border-dark rounded-3 p-3' >
            <form >
                <div className="mb-3">
                    <label htmlFor="exampleInputusername" className="form-label" >User Name</label>
                    <input type="text" name="name" className="form-control" id="name" aria-describedby="emailHelp" onChange={handlechange}  style={{width:"97%"}} />
                </div>
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
          <div className="mb-3">
                    <label htmlFor="exampleInputusername" className="form-label" >Family Code</label>
                    <input type="text" name="familycode" className="form-control" id="familycode" style={{width:"97%"}} aria-describedby="" onChange={handlechange} />
                </div>

                <div class="form-check form-switch">
                  <input class="form-check-input" name ="role"  onChange={handleRoleChange} type="checkbox" id="flexSwitchCheckDefault" />
                  <label class="form-check-label" for="flexSwitchCheckDefault">Do you want to become a Admin?</label>
                </div>


         
                <div className="mb-3 mt-3">
                    <label htmlFor="exampleInputprofile" className="form-label">Profile pic</label>
            <input type='file' name='file' accept='image/*' style={{width:"97%"}} className="form-control" id="exampleInputprofile" onChange={(e) => {
              postDetails(e.target.files[0])
            }} />
          </div>

          {/* code */}
          <br />
            </form>
          <button 
            disabled={isloadingimg || credentials.email.length < 8 || credentials.password.length < 5 }
            className="btn btn-primary"
            onClick={handleSendOTP}    
          >{
              isloadingimg ? (<div className="spinner-border"  role="status">
                <span className="visually-hidden">Loading...</span>
              </div>): ("  Send OTP  ")
          }
           
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
              </div> : "Register"}</button>
            </div>
          </div>
        </div>
      </div>
      </div>



   </>
  )
}

export default Signup

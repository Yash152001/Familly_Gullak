import AuthContext from "./authcontext";
import React, { useState } from "react";

const AuthState = (props) => {
  const host = "http://localhost:5000";
  const credentialsinitial = [];
  const [credentials, setCredentials] = useState(credentialsinitial);

   const getUser = async () => {
     const response = await fetch(`${host}/api/auth/getuser`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         token: localStorage.getItem("token"),
       },
     });
     const json = await response.json();
     setCredentials(json);
   };
  //  const changePassword = async (id, password) => {
  //    const response = await fetch(${host}/api/notes/changepassword/${id}, {
  //      method: "POST",
  //      headers: {
  //        "Content-Type": "application/json",
  //        authToken: localStorage.getItem("token"),
  //      },
  //      body: JSON.stringify({
  //       password
  //      }),
  //    });
  //    const json = await response.json();
  //    console.log(json);
  //    let newCredentials = JSON.parse(JSON.stringify(credentials));

  //    for (let index = 0; index < credentials.length; index++) {
  //      const element = newCredentials[index];
  //      if (element._id === id) {
  //        newCredentials[index].password = password;
  //        break;
  //      }
  //    }
  //    setCredentials(newCredentials);
  //  };
   return (
      <AuthContext.Provider
        value={{
          credentials,
          setCredentials,
          getUser
        }}
      >
        {props.children}
      </AuthContext.Provider>
    );

}
export default AuthState;
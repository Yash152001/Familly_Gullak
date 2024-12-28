import React from "react";
import NoteContext from "./notecontext";
import { useState } from "react";


const NoteState = (props) => {
  const host = "http://localhost:5000/";
  const notesInitial = [];
  const [policies, setPolicy] = useState(notesInitial);

  // get all notes
 
  const getNotes = async () => {
    // api call
    const response = await fetch(`${host}api/notes/fetchpolicy`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    // console.log(json)
    setPolicy(json);
  };
  // add note

  const addPolicy = async (title, description, effectiveDate , expiryDate ,  monthlyContributionAmount , EmergencyFund ,  penaltyDetails) => {
    // api call
    const response = await fetch(`${host}api/notes/createpolicy`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, effectiveDate,expiryDate ,  monthlyContributionAmount  , EmergencyFund  ,penaltyDetails}), 
      // body data type must match "Content-Type" header
    });
    const policy = await response.json();
    console.log(policies);
    setPolicy(policies.concat(policy));
   
  };

  // delete note

  const deleteNote = async (id) => {
    // api call

    const response = await fetch(`${host}api/notes/deletenote/${id}`, {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    });
    const json = await response.json();

    const newNotes = policies.filter((note) => {
      return note._id !== id;
    });
    setPolicy(newNotes);
  };
  // edit note

  const editNote = async (id, title, description, tag, images , pdf ,  video) => {
    // api call
    const response = await fetch(`${host}api/notes/updatenote/${id}`, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag , images:localStorage.getItem("link") , pdf:localStorage.getItem("pdf")  , video:localStorage.getItem("video") }), // body data type must match "Content-Type" header
    });
    const json = await response.json(); // parses JSON response into native JavaScript objects

    let newNotes = JSON.parse(JSON.stringify(policies));

    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        newNotes[index].images = images;
        newNotes[index].pdf = pdf;
        newNotes[index].video = video;
        break;
      } 
    }
    setPolicy(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{ policies, setPolicy, addPolicy, deleteNote, editNote, getNotes}}
    >
      {props.children}
    </NoteContext.Provider>
  );
};
export default NoteState;

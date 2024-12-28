import React, { useContext, useRef, useState } from 'react'
import noteContext from '../context/notes/notecontext';
import NoteItem from './NoteItem';
import './css/Notes.css'
import AddNote from './AddNote';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


export default function Notes() {
    const [isloading, setIsloading] = useState(false)
    const context = useContext(noteContext)
    const { policies, getNotes, editNote } = context;
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "", eimages:""  ,  epdf:""  ,evideo:""})
    let history = useHistory();
    useEffect(() => {
        if (localStorage.getItem("token")) {
            getNotes()
        }
        else {
            history.push("/login")
        }
        // eslint-disable-next-line
    }, [])
    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({
            id: currentNote._id,
            etitle: currentNote.title,
            edescription: currentNote.description,
            etag: currentNote.tag,
            eimages:currentNote.images,
            epdf:currentNote.pdf,
            evideo:currentNote.video,
        });


    }
    const ref = useRef(null)
   
    return (
        <>  
            <Link to="/addpolicy"className='d-flex justify-content-center align-center text-decoration-none ' style={{width:'100%'}}>
            <button className='btn btn-info bg-info rounded-3 m-0' style={{width:'90%'}} >Create Policy</button>
             </Link>
            <h1 style={{ margin: "15px" }}>Your Policies</h1>
            <div style={{ display: "flex", flexWrap: "wrap", margin: "10px" }}>
                {policies.length === 0 && "No Policy To Display"}
                {policies.map((note) => {
                    return <NoteItem updateNote={updateNote} key={note._id} note={note} />
                })}
            </div>

        </>
    )
}

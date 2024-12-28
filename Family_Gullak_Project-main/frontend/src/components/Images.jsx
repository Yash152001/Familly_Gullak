import React, { useContext } from 'react'
import noteContext from '../context/notes/notecontext';
import './css/Notes.css'
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ImagesIteam from './ImagesIteam';


export default function Images() {
    const context = useContext(noteContext)
    const { notes, getImages } = context;
    let history = useHistory();
    useEffect(() => {
        if (localStorage.getItem("token")) {
            getImages()
        }
        else {
            history.push("/login")
        }
        // eslint-disable-next-line
    }, [])
    return (
        <>
            <h1 style={{ margin: "15px" }}>Your Images</h1>
            <div style={{ display: "flex", flexWrap: "wrap", margin: "10px" }}>
                {notes.length === 0 && "No Images To Display"}
                {notes.map((note) => {
                    return <ImagesIteam key={note._id} note={note} />
                })}
            </div>

        </>
    )
}

import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getNotesAsync,selectNotes } from './app/noteSlice'
import {selectToken} from './app/loginSlice'
const Note = () => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const notes = useSelector(selectNotes);

    return (
        <div>
            {notes.length >0 &&  notes.map( note=> <div>{note.body}{" "} {note.user} </div>)}
            <button onClick={()=>dispatch(getNotesAsync(token))}>get Data</button>
        </div>
    )
}

export default Note
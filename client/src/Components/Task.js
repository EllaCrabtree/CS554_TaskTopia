/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import Error from './Error';
import AddNote from './AddNote';

function Task(props) {
    const [taskData, setTaskData] = useState(null);
    const [err, setErr] = useState(false);
    const [addBtnToggle, setBtnToggle] = useState(false);
    const [errData, setErrData] = useState(undefined);
    const [deleteTask, setDeleteTask] = useState(null);

    useEffect(() => {
        setTaskData(props.taskData);
    }, [])

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const { data } = await axios.get(`http://localhost:4000/private/task/${props.buildingId}/${props.taskId}`);
    //             setTaskData(data);
    //         } catch (e) {
    //             setErr(true);
    //             setErrData(e);
    //             console.log(e);
    //         }
    //     }
        
    //     fetchData()
    // }, [props.buildingId, props.taskId, addBtnToggle]);

    async function addNotesCallback(newData) {
        setTaskData(newData);
    }

    async function completeTask() {
        try {
            await axios.get(`http://localhost:4000/private/buildings/completeTask/${props.buildingId}`);
            await axios.delete(`http://localhost:4000/private/task/${props.buildingId}/${props.taskData._id.toString()}`);
            
            setDeleteTask(true);
        } catch (e) {
            console.log("oof");
            setErr(true);
            setErrData(e);
            console.log(e);
        }
    }
    return (<div>
        {taskData && !deleteTask && !err &&
            <div className='taskContainer'>
                {taskData.name && <h1>{taskData.name}</h1>}
                {taskData.dateDue && <h2>{taskData.dateDue}</h2>}
                {taskData.isCompleted && <h2>{taskData.isCompleted}</h2>}
                {taskData.isOverdue && <h2>{taskData.isOverdue}</h2>}
                {taskData.notes && taskData.notes.map((element,index) => {
                    return (
                        <p key={index}>{element}</p>
                    )
                })}
                {taskData.datePosted && <p>{taskData.datePosted}</p>}
                {!addBtnToggle ? <button onClick={() => setBtnToggle(!addBtnToggle)} >Add New Note</button> : <button onClick={() => setBtnToggle(!addBtnToggle)} > Stop Adding New Notes</button>}
                <br />
                <button onClick={completeTask}>Complete Task</button>
                <br />
                {addBtnToggle && <AddNote buildingId={props.buildingId} taskId={props.taskData._id.toString()} callback={addNotesCallback} />}
            </div>}
        {err && <Error error={errData} />}
    </div>
    )
}

export default Task;
import { useState, useEffect } from 'react';
import axios from 'axios';
import Error from './Error';

function Task(props) {
    const [taskData, setTaskData] = useState(null);
    const [err, setErr] = useState(false);
    const [errData, setErrData] = useState(undefined);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:4000/task/${props.buildingId}/${props.taskId}`);
                setTaskData(data);
            } catch (e) {
                setErr(true);
                setErrData(e);
                console.log(e);
            }
        }
        fetchData()
    }, [props.buildingId, props.taskId]);

    return (<div>
        {taskData &&
            <div className='taskContainer'>
                {taskData.name && <h1>{taskData.name}</h1>}
                {taskData.dateDue && <h2>{taskData.dateDue}</h2>}
                {taskData.isCompleted && <h2>{taskData.isCompleted}</h2>}
                {taskData.isOverdue && <h2>{taskData.isOverdue}</h2>}
                {taskData.notes && <p>{taskData.notes}</p>}
                {taskData.datePosted && <p>{taskData.datePosted}</p>}
                <button>Add Note (TODO)</button>
            </div>}
        {err && <Error error={errData} />}
    </div>
    )
}

export default Task;
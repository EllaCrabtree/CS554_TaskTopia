/* eslint-disable react/prop-types */
import React,{ useState } from 'react';
import Task from './Task';
import axios from 'axios';
import Error from './Error';

function AddTask(props) {
    const [formData, setFormData] = useState({ buildingId: props.buildingId });
    const [createdTask, setCreated] = useState(undefined);
    const [err, setErr] = useState(false);
    const [errData, setErrData] = useState(undefined);
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    async function CreateTask() {
        try {
            const { data } = await axios.post(`http://localhost:4000/private/task/`, formData);
            setCreated(data);
        } catch (e) {
            setErr(true);
            setErrData(e);
            console.log(e);
        }
    }
    return (<div> {!err &&
        <div>
            <div className='add'>
                <div className='input-selection'>
                    <label>
                        Name:
                        <input
                            onChange={(e) => handleChange(e)}
                            id='name'
                            name='name'
                        />
                    </label>
                    <label>
                        Due Date:
                        <input type="date"
                            onChange={(e) => handleChange(e)}
                            id='dateDue'
                            name='dateDue'
                        />
                    </label>
                </div>
                <button onClick={CreateTask}>Create Task</button>
            </div>
        </div>}
        {createdTask && !err && <Task buildingId={props.buildingId} taskId={createdTask._id} />}
        {err && <Error error={errData} />}
    </div>
    );
}

export default AddTask;
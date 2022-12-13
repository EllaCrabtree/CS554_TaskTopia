import { useState } from 'react';
import Task from './Task';
import axios from 'axios';


function AddTask(props) {
    const [formData, setFormData] = useState({});
    const [createdTask, setCreated] = useState(undefined);
    const [err, setErr] = useState(false);
    const [errData, setErrData] = useState(undefined);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    async function CreateTask() {
        try {
            const { data } = await axios.post(`http://localhost:4000/task/`, formData);
            setCreated(data);
        } catch (e) {
            setErr(true);
            setErrData(e);
            console.log(e);
        }
    };

    return (!createdTask && !err &&
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
                    <label>
                        Notes:
                        <input
                            onChange={(e) => handleChange(e)}
                            id='notes'
                            name='notes'
                            placeholder='Notes...'
                        />
                    </label>
                    <label>
                        Date Posted:
                        <input type="date"
                            onChange={(e) => handleChange(e)}
                            id='datePosted'
                            name='datePosted'
                        />
                    </label>
                </div>
                <button onClick={CreateTask}>Create Task</button>
            </div>
            {createdTask && !err && <Task buildingId={props.id} taskId={createdTask._id} />}
            {err &&
                <div>
                    <h1>{errData.response.status}: {errData.response.statusText}</h1>
                    <p>{errData.response.data.error}</p>
                </div>}
        </div>
    );
}

export default AddTask;
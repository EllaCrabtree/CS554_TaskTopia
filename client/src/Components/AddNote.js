/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';
import axios from 'axios';
import Error from './Error';

function AddNote(props) {
    const [formData, setFormData] = useState({ buildingId: props.id });
    const [createdNote, setCreated] = useState(undefined);
    const [err, setErr] = useState(false);
    const [errData, setErrData] = useState(undefined);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    async function AddNotes() {
        try {
            const { data } = await axios.post(`http://localhost:4000/private/task/addNotes`, formData);
            setCreated(data);
        } catch (e) {
            setErr(true);
            setErrData(e);
            console.log(e);
        }
    }

    return (<div> {!createdNote && !err &&
        <div>
            <div className='add'>
                <div className='input-selection'>
                    <label>
                        Notes:
                        <input
                            onChange={(e) => handleChange(e)}
                            id='notes'
                            name='notes'
                        />
                    </label>
                </div>
                <button onClick={AddNotes}>Add Note</button>
            </div>
        </div>}
        {err && <Error error={errData} />}
    </div>
    );
}

export default AddNote;
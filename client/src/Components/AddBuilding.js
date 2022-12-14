import { useState } from 'react';
import Building from './Building';
import axios from 'axios';
import Error from './Error';


function AddBuilding() {
    const [formData, setFormData] = useState({ buildingType: '' });
    const [createdBuilding, setCreated] = useState(undefined);
    const [err, setErr] = useState(false);
    const [errData, setErrData] = useState(undefined);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    async function CreateBuilding() {
        try {
            const { data } = await axios.post(`http://localhost:4000/building/`, formData);
            setCreated(data);
        } catch (e) {
            setErr(true);
            setErrData(e);
            console.log(e);
        }
    };

    return (<div>
        {!createdBuilding && !err &&
            <div>
                <div className='add'>
                    <div className='input-selection'>
                        <label>
                            Building Type:
                            <select
                                onChange={(e) => handleChange(e)}
                                id='buildingType'
                                name='buildingType'
                            >
                                <option value="ADMIN">ADMIN</option>
                                <option value="EDUCATION">EDUCATION</option>
                                <option value="GARDEN">GARDEN</option>
                                <option value="HOME">HOME</option>
                                <option value="PARK">PARK</option>
                                <option value="STORE">STORE</option>
                            </select>
                        </label>
                        <label>
                            XP:
                            <input
                                onChange={(e) => handleChange(e)}
                                id='xp'
                                name='xp'
                                placeholder='XP...'
                            />
                        </label>
                        <label>
                            Max XP:
                            <input
                                onChange={(e) => handleChange(e)}
                                id='xpMax'
                                name='xpMax'
                                placeholder='Max XP...'
                            />
                        </label>
                        <label>
                            Level:
                            <input
                                onChange={(e) => handleChange(e)}
                                id='level'
                                name='level'
                                placeholder='Level...'
                            />
                        </label>
                    </div>
                    <button onClick={CreateBuilding}>Create Building</button>
                </div>
            </div>}
        {createdBuilding && !err && <Building id={createdBuilding._id} />}
        {err && <Error error={errData} />}
    </div>
    );
}

export default AddBuilding;
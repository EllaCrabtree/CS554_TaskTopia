/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Error from './Error';


function AddBuilding() {
    const [formData, setFormData] = useState({ buildingCode: 'ADMIN', level: 1 });
    const [createdBuilding, setCreated] = useState(undefined);
    const [err, setErr] = useState(false);
    const [errData, setErrData] = useState(undefined);
    const [createdBuildings, setCreatedBuildings] = useState([]);
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    async function CreateBuilding() {
        try {
            console.log(formData);
            const { data } = await axios.post(`http://localhost:4000/private/buildings/`, formData);
            setCreated(data);
            let tempCreatedBuildings = createdBuildings;
            tempCreatedBuildings.push(data);
            setCreatedBuildings(tempCreatedBuildings);
        } catch (e) {
            setErr(true);
            setErrData(e);
            console.log(e);
        }
    }

    return (<div>
        {createdBuilding && !err &&
            createdBuildings.map(element => {
                return (
                    <li key={element.buildingID+"inForm"}>
                        <h3>{element.name}</h3>
                        <Link className={element.buildingCode} to={`/buildings/${element.buildingID}`}> Type = {element.buildingCode} </Link>
                    </li>
                )
            })}
        {!err &&
            <li key={"addBuildingForm"}>
                <div>
                    <div className='add'>
                        <div className='input-selection'>

                            <label>
                                Building Name:
                                <input
                                    onChange={(e) => handleChange(e)}
                                    id='name'
                                    name='name'
                                    placeholder='Building Name...'>
                                </input>
                            </label>

                            <label>
                                Building Type:
                                <select
                                    onChange={(e) => handleChange(e)}
                                    id='buildingCode'
                                    name='buildingCode'
                                    defaultValue={'ADMIN'}
                                >
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="EDUCATION">EDUCATION</option>
                                    <option value="GARDEN">GARDEN</option>
                                    <option value="HOME">HOME</option>
                                    <option value="PARK">PARK</option>
                                    <option value="STORE">STORE</option>
                                </select>
                            </label>
                            {/* <label>
                            XP:
                            <input
                                onChange={(e) => handleChange(e)}
                                id='xp'
                                name='xp'
                                placeholder='XP...'
                            />
                        </label> */}
                            <label>
                                Max XP:
                                <input
                                    onChange={(e) => handleChange(e)}
                                    id='xpMax'
                                    name='xpMax'
                                    type='number'
                                    placeholder='Max XP...'
                                />
                            </label>
                            <label>
                                Level:
                                <select
                                    onChange={(e) => handleChange(e)}
                                    id='level'
                                    name='level'
                                    defaultValue={1}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </label>
                        </div>
                        <button onClick={CreateBuilding}>Create Building</button>
                    </div>
                </div>
            </li>}
        {err && <Error error={errData} />}
    </div>
    );
}

export default AddBuilding;
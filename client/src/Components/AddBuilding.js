/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Error from './Error';
import { AuthContext } from '../firebase/Auth';


function AddBuilding() {
    const { currentUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({ user: currentUser.email, buildingCode: 'ADMIN', level: 1 });
    const [err, setErr] = useState(false);
    const [errData, setErrData] = useState(undefined);
    const [createdBuildings, setCreatedBuildings] = useState([]);
    const [deleteData, setDeleteData] = useState(null);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        async function deleteBuilding() {
            try {
                console.log(deleteData);
                console.log(`http://localhost:4000/private/buildings/` + deleteData._id);
                const { data } = await axios.delete(`http://localhost:4000/private/buildings/` + deleteData._id);
                setDeleteData(null);

                setCreatedBuildings(createdBuildings.filter((building) => building.key !== deleteData._id + "inForm"));

                console.log(data);
            } catch (e) {
                setErr(true);
                setErrData(e);
                console.log(e);
            }
        }
        if (deleteData) {
            deleteBuilding()
        }
    }, [deleteData, createdBuildings]);


    async function CreateBuilding() {
        try {
            console.log(formData);
            const { data } = await axios.post(`http://localhost:4000/private/buildings/`, formData);
            setCreatedBuildings((prev) => [...prev, { key: data._id + "inForm", building: data }]);
            console.log(data);

        } catch (e) {
            setErr(true);
            setErrData(e);
            console.log(e);
        }
    }

    return (<div>
        {createdBuildings && !err && createdBuildings.map((building) => {
            return (
                <li className='liNoDot' key={building.key}>
                    <h3>{building.building.name}</h3>
                    <Link className={building.building.buildingCode} to={`/buildings/${building.building._id}`}> Type = {building.building.buildingCode} </Link>
                    <button onClick={() => setDeleteData(building.building)}>Delete Building</button>
                </li>)
        })}

        {!err &&
            <ul>
                <li className='liNoDot' key={"addBuildingForm"}>
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
                </li>
            </ul>}

        {err && <Error error={errData} />}

    </div>);
}


export default AddBuilding;
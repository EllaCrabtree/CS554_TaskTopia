/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddTask from './AddTask'
import Task from './Task';
import Error from './Error';
import Avatar from './Avatar';
import { useParams } from 'react-router-dom';

function Building(props) {
    const [buildingData, setBuildingData] = useState(null);
    const [addBtnToggle, setBtnToggle] = useState(false);
    const [err, setErr] = useState(false);
    const [errData, setErrData] = useState(undefined);

    let { buildingId } = useParams();
    if (!buildingId) {
        buildingId = props.buildingId;
    }
    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:4000/private/buildings/${buildingId}`);
                setBuildingData(data);
            } catch (e) {
                setErr(true);
                setErrData(e);
                console.log(e);
            }
        }
        fetchData()
    }, [buildingId, addBtnToggle]);

    return (<div>
        {buildingData &&
            <div className='buildingContainer'>
                {/* {buildingData.buildingCode && buildingData.level && <img alt={`${buildingData.buildingCode} Building`} src={require(`../icons/Buildings/${buildingData.buildingCode}/${buildingData.level}.png`)} />} */}
                {buildingData.buildingCode && <h1>{buildingData.buildingCode}</h1>}
                {buildingData.xp && <h2>Current XP:{buildingData.xp}</h2>}
                {buildingData.xpMax && <h2>Max XP:{buildingData.xpMax}</h2>}
                {buildingData.level && <h2>Level:{buildingData.level}</h2>}
                {buildingData.Avatars && buildingData.Avatars.map(element => {
                    return (
                        <Avatar id={element._id} key={element._id} />)
                })}
                {buildingData.Tasks && buildingData.Tasks.map(element => {
                    return (
                        <Task buildingId={buildingId} taskId={element._id} key={element._id} />)
                })}
                {!addBtnToggle ? <button onClick={() => setBtnToggle(!addBtnToggle)} >Add New Tasks</button> : <button onClick={() => setBtnToggle(!addBtnToggle)} > Stop Adding New Tasks</button>}
                <br />
                <br />
                <br />
                {addBtnToggle && <AddTask buildingId={buildingId} />}
            </div>
        }
        {err && <Error error={errData} />}
    </div >)
}

export default Building;
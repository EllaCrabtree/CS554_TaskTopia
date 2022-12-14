import { useState, useEffect } from 'react';
import axios from 'axios';
import AddTask from './AddTask'
import Task from './Task';
import Error from './Error';

function Building(props) {
    const [buildingData, setBuildingData] = useState(null);
    const [addBtnToggle, setBtnToggle] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:4000/building/${props.id}`);
                setBuildingData(data);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData()
    }, [props.id]);

    return (<div>
        {buildingData &&
            <div className='buildingContainer'>
                {buildingData.buildingCode && <h1>{buildingData.buildingCode}</h1>}
                {buildingData.xp && <h2>Current XP:{buildingData.xp}</h2>}
                {buildingData.xpMax && <h2>Max XP:{buildingData.xpMax}</h2>}
                {buildingData.level && <h2>Level:{buildingData.level}</h2>}
                {buildingData.avatars && buildingData.avatars.map(element => {
                    return (
                        <Avatar id={element._id} />)
                })}
                {buildingData.tasks && buildingData.tasks.map(element => {
                    return (
                        <Task buildingId={props.id} taskId={element._id} />)
                })}
                {!addBtnToggle ? <button onClick={() => setBtnToggle(!addBtnToggle)} >Add New Tasks</button> : <button onClick={() => setBtnToggle(!addBtnToggle)} > Stop Adding New Tasks</button>}
                <br />
                <br />
                <br />
                {addBtnToggle && <AddTask buildingId={props.id} />}
            </div>
        }
        {err && <Error error={errData} />}
    </div >)
}

export default Building;
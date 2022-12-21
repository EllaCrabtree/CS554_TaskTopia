/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddTask from './AddTask'
import Task from './Task';
import Error from './Error';
// import Avatar from './Avatar';
import { useParams } from 'react-router-dom';
import CreateAvatar from './CreateAvatar';

function Building(props) {
    const [buildingData, setBuildingData] = useState(null);
    const [addBtnToggle, setBtnToggle] = useState(false);
    const [err, setErr] = useState(false);
    const [errData, setErrData] = useState(undefined);
    const [avatarID, setAvatar] = useState(null);

    //State to indicate a new task has been added
    const [taskCreated, setTaskCreated] = useState(null);

    //States to determine what the avatar says
    const [welcome, setWelcome] = useState(false);
    const [taskOverdue, setTaskOverdue] = useState(false);
    const [taskComplete, setTaskComplete] = useState(false);

    const [welcomeList, setWelcomeList] = useState([]);
    const [niceList, setNiceList] = useState([]);
    const [meanList, setMeanList] = useState([]);

    let { buildingId } = useParams();

    useEffect(() => {
        async function fetchData() {
            try {
                console.log(props.id)
                const { data } = await axios.get(`http://localhost:4000/private/buildings/${buildingId}`);
                setBuildingData(data);

                
                // console.log(data.Avatar)

                const overdueTasks = buildingData.Tasks.filter(elem => {
                    elem.isOverdue == true;
                })

                // console.log(overdueTasks.length)

                if (overdueTasks.length === 0) {
                    setWelcome(true)
                    setTaskOverdue(false)
                } else {
                    setWelcome(false)
                    setTaskOverdue(true)
                }
                
            } catch (e) {
                setErr(true);
                setErrData(e);
                console.log(e);
            }
        }
        fetchData()
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                console.log(props.id)
                const { data } = await axios.get(`http://localhost:4000/private/buildings/${buildingId}`);
                setBuildingData(data);

                setTaskCreated(false);
            } catch (e) {
                setErr(true);
                setErrData(e);
            }
        }

        if (taskCreated) {
            fetchData();
        }
    }, [taskCreated])

    const getMessages = (welcome, nice, mean) => {

        console.log('im getting to callback function')
        console.log(welcome);

        setWelcomeList(welcome);
        setNiceList(nice);
        setMeanList(mean);

        console.log(welcome);
    }

    const addTaskCallback = (newTask) => {
        console.log(newTask)
        let newBuildingData = {...buildingData}
        newBuildingData.Tasks = [...newBuildingData.Tasks, newTask]
        setBuildingData(newBuildingData)
    }

    const getWelcomeMessage = () => {
        console.log('hello')
        console.log(welcomeList[Math.random() * welcomeList.length])
        return welcomeList[Math.random() * welcomeList.length];
    }

    const getNiceMessage = () => {
        return niceList[Math.random() * niceList.length];
    }

    const getMeanMessage = () => {
        return meanList[Math.random() * meanList.length];
    }

    // function avatarCallback(id) {
    //     setAvatar(id);
    // }

    return (<div>
        {buildingData &&
            <div className='buildingContainer'>

                {buildingData.name && <h1>{buildingData.name}</h1>}
                {/* {buildingData.xp && <h2>Current XP:{buildingData.xp}</h2>}
                {buildingData.xpMax && <h2>Max XP:{buildingData.xpMax}</h2>} */}
                {buildingData && <h2>{buildingData.xpMax-buildingData.xp} XP left till Level {buildingData.level}</h2>}

                <div id='AvatarDiv'>
                    <CreateAvatar buildingId={buildingId} avatarID={buildingData.Avatar} callBackFunc={getMessages}/>
                    <div id='AvatarMessages'>
                        {welcome && <p>{getWelcomeMessage()}</p>}
                        {taskOverdue && <p>{getMeanMessage()}</p>}
                        {taskComplete && <p>{getNiceMessage()}</p>}
                    </div>
                </div>
                

                


                {/* {buildingData.buildingCode && buildingData.level && <img alt={`${buildingData.buildingCode} Building`} src={require(`../icons/Buildings/${buildingData.buildingCode}/${buildingData.level}.png`)} />} */}
                {/* {buildingData.buildingCode && <h2>{buildingData.buildingCode}</h2>} */}
                {/* {buildingData.xp && <h2>Current XP:{buildingData.xp}</h2>}
                {buildingData.xpMax && <h2>Max XP:{buildingData.xpMax}</h2>}
                {buildingData.level && <h2>Level:{buildingData.level}</h2>} */}
                {/* {buildingData.Avatars && buildingData.Avatars.map(element => {
                    return (
                        <Avatar id={element._id} key={element._id} />)
                })} */}

                {!buildingData.Tasks && <h3> You do not have any tasks!  Click below to add one!</h3>}

                {buildingData.Tasks && buildingData.Tasks.map(element => {
                    return (
                        <Task buildingId={buildingData._id} taskData={element} key={element._id} />)
                })}
                {!addBtnToggle ? <button onClick={() => setBtnToggle(!addBtnToggle)} >Add New Tasks</button> : <button onClick={() => setBtnToggle(!addBtnToggle)} > Stop Adding New Tasks</button>}
                <br />
                <br />
                <br />
                {addBtnToggle && <AddTask buildingId={buildingData._id} callback={addTaskCallback} />}
            </div>
        }

        {/* {avatarID && <Avatar buildingID={buildingData._id}/>} */}
        

        {/* {err && <Error error={errData} />} */}
    </div >)
}

export default Building;
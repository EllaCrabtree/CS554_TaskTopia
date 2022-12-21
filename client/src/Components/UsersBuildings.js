import React,{ useState, useEffect } from 'react';
import axios from 'axios';
// import Building from './Building';
import Error from './Error';
import AddBuilding from './AddBuilding';
import { Link } from 'react-router-dom';
// import { AuthContext } from "../firebase/Auth";



function UsersBuildings() {
    // const currentUser = useContext(AuthContext);

    const [buildingData, setBuildingData] = useState(null);
    const [addBuildingForm, setAddBuildingForm] = useState(false);
    const [err, setErr] = useState(false);
    const [errData, setErrData] = useState(undefined);
    const [deleteData, setDeleteData] = useState(null);


    function changeBuildingsAfterDelete(buildingId) {
        const newBuildingData = buildingData.filter(building => building.buildingId != buildingId)
        setBuildingData(newBuildingData);
    }

    useEffect(() => {
        async function fetchData() {
            try {
                // const { user } = await axios.get(`http://localhost:4000/private/users/uid/${currentUser.currentUser.uid}`)
                const { data } = await axios.get(`http://localhost:4000/private/users/buildings/odline`)
                console.log(data);
                
                if (data.length == 0) {
                    setBuildingData(false)
                } else {
                    setBuildingData(data);
                }
            } catch (e) {
                setErr(true);
                setErrData(e);
                console.log(e);
            }
        }
        async function deleteBuilding() {
            try {
                // console.log(`http://localhost:4000/private/buildings/${deleteData.buildingID}`);
                const { data } = await axios.delete(`http://localhost:4000/private/buildings/${deleteData.buildingID}`);

                console.log(deleteData)
                await axios.delete(`http://localhost:4000/avatar/${deleteData.Avatar}`)
                setDeleteData(null);
                console.log(data);
                changeBuildingsAfterDelete(deleteData.buildingID)
            } catch (e) {
                setErr(true);
                setErrData(e);
                console.log(e);
            }
        }
        
        if(deleteData){
            deleteBuilding()
        } else {
            fetchData()
        }
    },[addBuildingForm, deleteData]);


    const getBuildingForm = () => {
        setAddBuildingForm(!addBuildingForm);
    }

    return (
    <div>
        {!buildingData && <h1> No building data</h1>}
       
        {buildingData &&<ul>
            {buildingData.map(element => {
                return (
                    <li key={element.buildingID}>
                        <h3>{element.name}</h3>
                        <Link className={element.code} to={`/buildings/${element.buildingID}`}> Type = {element.code} </Link>
                        <button onClick={() => setDeleteData(element)}>Delete Building</button>
                    </li>
                )
            })} 
            </ul>
        }
        {addBuildingForm && <AddBuilding />}
        
        {err && <Error error={errData} />}
        <button onClick={getBuildingForm}>Create A New Building</button>
    </div >)
}

export default UsersBuildings;
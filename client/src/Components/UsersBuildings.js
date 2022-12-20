import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import Building from './Building';
import Error from './Error';

function UsersBuildings() {
    const [buildingData, setBuildingData] = useState(null);
    const [err, setErr] = useState(false);
    const [errData, setErrData] = useState(undefined);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:4000/private/users/buildings`);
                setBuildingData(data);
            } catch (e) {
                setErr(true);
                setErrData(e);
                console.log(e);
            }
        }
        fetchData()
    },[]);

    return (<div>
        {buildingData &&
            buildingData.map(element => {
                return <Building id={element} key={element}/>
            })
        }
        {err && <Error error={errData} />}
    </div >)
}

export default UsersBuildings;
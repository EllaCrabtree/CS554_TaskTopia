/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from 'react';
import axios from 'axios';
import Badge from './Badge';
import Error from './Error';

function AllBadges() {
    const [badgesData, setBadgesData] = useState(null);
    const [err, setErr] = useState(false);
    const [errData, setErrData] = useState(undefined);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:4000/badge/all`);
                setBadgesData(data);
            } catch (e) {
                setErr(true);
                setErrData(e);
                console.log(e);
            }
        }
        fetchData()
    });

    return (
        <div>
            {badgesData && badgesData.map(element => {
                return (<Badge id={element._id} key={element._id}/>)
            })
            }
            // eslint-disable-next-line react/react-in-jsx-scope
            {err && <Error error={errData} />}
        </div>)
}

export default AllBadges;
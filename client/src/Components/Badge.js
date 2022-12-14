import { useState, useEffect } from 'react';
import axios from 'axios';
import Error from './Error';

function Badge(props) {
    const [badgeData, setBadgeData] = useState(null);
    const [err, setErr] = useState(false);
    const [errData, setErrData] = useState(undefined);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:4000/badge/${props.id}`);
                setBadgeData(data);
            } catch (e) {
                setErr(true);
                setErrData(e);
                console.log(e);
            }
        }
        fetchData()
    }, [props.id]);

    return (<div>
        {badgeData &&
            <div className='badgeContainer'>
                {badgeData.type && badgeData.building && < img height={300} width={300} className='badgeIcon' alt={`${badgeData.type} level badge for ${badgeData.building} building`} src={require(`../icons/Badges/${badgeData.building}_${badgeData.type}.png`)} />}
                {badgeData.description && <p className='badgeDescription'>{badgeData.description}</p>}
            </div>
        }
        {err && <Error error={errData} />}
    </div>)
}

export default Badge;
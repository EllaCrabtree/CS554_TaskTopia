import { useState, useEffect } from 'react';
import axios from 'axios';
import Badge from './Badge';

function AllBadges() {
    const [badgesData, setBadgesData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:4000/badge/all`);
                setBadgesData(data);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData()
    });

    return (badgesData && badgesData.map(element => {
        return (<Badge id={element._id} />)
    })
    )
}

export default AllBadges;
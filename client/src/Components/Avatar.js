import { useState, useEffect } from 'react';
import axios from 'axios';
import Error from './Error';

function Avatar(props) {
    const [avatarData, setAvatarData] = useState(null);
    const [err, setErr] = useState(false);
    const [errData, setErrData] = useState(undefined);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:4000/private/avatars/${props.id}`);
                setAvatarData(data);
            } catch (e) {
                setErr(true);
                setErrData(e);
                console.log(e);
            }
        }
        fetchData()
    }, [props.id]);

    return (<div>
        {avatarData &&
            <div className='avatarContainer'>
                <p>TODO show avatar data</p>
            </div>
        }
        {err && <Error error={errData} />}
    </div >)
}

export default Avatar;
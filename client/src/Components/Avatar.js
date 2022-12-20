/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Error from './Error';
import { motion } from 'framer-motion'


function Avatar(props) {
    const [avatarData, setAvatarData] = useState(null);
    // const [err, setErr] = useState(false);
    // const [errData, setErrData] = useState(undefined);

    useEffect(() => {
        async function fetchData() {
            try {
                setAvatarData(props.avatarImage);
            } catch (e) {
                // setErr(true);
                // setErrData(e);
                console.log(e);
            }
        }
        fetchData()
    }, [props.id]);

    // return (<div>
    //     {avatarData &&
    //         <div className='avatarContainer'>
    //             <p>TODO show avatar data</p>
    //         </div>
    //     }
    //     {err && <Error error={errData} />}
    // </div >)

    return( <div>
        <motion.div
        style={{ height: 250, width: 250}} 
        animate={{
            scale: 1.05,
            // backgroundColor: '#fff',
            // boxShadow: '10px 10px 0 rgba(0, 0, 0, 0.2)',
            transition: {
                repeat: Infinity, repeatType: 'reverse'
            }
        }}
        >
            {avatarData != null && <img id='avatarImage' src={avatarData} alt='Odin'/>}
        </motion.div >
    </div>)
}

export default Avatar;
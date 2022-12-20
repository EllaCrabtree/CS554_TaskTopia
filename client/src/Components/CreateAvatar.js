/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import Building from './Building';
import Avatar from './Avatar';
import axios from 'axios';
import Error from './Error';
import { motion } from 'framer-motion'

function CreateAvatar(props) {

    const [formData, setFormData] = useState({ buildingType: '' });
    const [nameData, setName] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [createdAvatar, setCreated] = useState(undefined);
    const [err, setErr] = useState(false);
    const [errData, setErrData] = useState(undefined);

    const [welcomeList, setWelcomeList] = useState([]);
    const [niceList, setNiceList] = useState([]);
    const [meanList, setMeanList] = useState([]);


    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleImageChange = (img) => {
        console.log(img.target.files[0])
        const reader = new FileReader();
        reader.readAsDataURL(img.target.files[0]);

        reader.onloadend = () => {
            // console.log('hi')
            // console.log(reader.result)
            setFormData({'img': reader.result});
        }
    }

    const handleWelcomeListChange = (entry) => {

        let newList = [...welcomeList, entry]
        
        setWelcomeList(newList);
    }

    const handleNiceListChange = (entry) => {
        let newList = [...niceList, entry];
        setNiceList(newList);
    }

    const handleMeanListChange = (entry) => {
        let newList = [...meanList, entry]
        setMeanList(newList);
        // console.log(newList);
        // console.log(meanList)
    }

    // const readImageBinary = (img) => {
    //     const reader = new FileReader();

    //     reader.onloadend = () => {
    //         setImageData(reader.result);
    //         console.log(reader.result)
    //     }

    //     reader.readAsDataURL(new Blob([img]));

    // }

    useEffect(() => {
        async function fetchData() {
            try {
                let {avatarID, callBackFunc} = props;

                // console.log('HI I"M HERE')
                if (avatarID !== 'NONE') {
                    setCreated(true);
                    console.log(avatarID);
                    const { data } = await axios.get(`http://localhost:4000/avatar/${avatarID}`);
                    console.log(data);

                    setImageData(data.image);
                    console.log(data.image);
                    callBackFunc(data.welcome, data.completion, data.overdue)
                } else {
                    setCreated(false);
                }

            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, []);

    async function CreateAvatar() {
        try {

            // console.log(formData);

            let {avatarID, callBackFunc, buildingId} = props;

            // console.log(avatarID)
            // console.log(buildingId);

            //Note: the header is necessary to pass the form data, including the image, to the backend
            //Otherwise, Axios may throw a 413 due to the file size
            // console.log('This is the form data being passed')
            
            let newFormData = {
                name: nameData,
                img: formData.img,
                welcomeList: welcomeList,
                niceList: niceList,
                meanList: meanList,
                buildingID: buildingId
            }

            console.log(newFormData.img);

            // console.log(newFormData)
            const { data } = await axios.post(`http://localhost:4000/avatar/`, newFormData, {headers: {"content-type": "multipart/form-data"}});

            setImageData(data.image);
            console.log(data.image);
            callBackFunc(welcomeList, niceList, meanList)

            // cb_setImage(data.image);
            

        } catch (e) {
            setErr(true);
            setErrData(e);
            console.log(e);
        }
    }

    async function GetAvatar() {
        try {
            console.log();
            const { data } = await axios.get(`http://localhost:4000/avatar/`);
            console.log(data)

            // let urmom = url(data.image);

            // setImageData(data.image);
            setImageData(data.image);
            console.log(data.image)
            // console.log(imageData);
        } catch (e) {
            console.log(e);
        }
    }

let meanTextBox, niceTextBox, welcomeTextBox;

// let welcomeTextBox, niceTextBox, meanTextBox;

    return (<div>

        <div>
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
            {imageData != null && <img id='avatarImage' src={imageData} alt='Odin'/>}
        </motion.div >
        </div>
        


        {!createdAvatar && !err &&
            <div>
                <div className='add'>
                    <div className='input-selection'>

                        <label>
                            Give your Avatar a name!
                            <input 
                                onChange={(e) => handleNameChange(e)}
                                type='text'
                                id='name'
                                name='name'
                                >
                                
                            </input>
                        </label>
                        <br/>

                        <label>
                            Upload Avatar's Image:
                            <input 
                                onChange={(e) => handleImageChange(e)}
                                type="file" 
                                id="img" 
                                name="img" 
                                accept="image/*"
                                encType="multipart/form-data" />
                        </label>
                        <br/>

                        {/* <label>
                            How do you want your avatar to greet you?

                            {welcomeTextBox}
                            <button onClick={handleWelcomeListChange(welcomeTextBox.value)}>Add message</button>
                        </label>
                        <br/>
                        <ul>

                        </ul> */}

                        

                        {/* <label>
                            What do you want the avatar to say when you complete a task?

                            {niceTextBox}
                            <button onClick={handleNiceListChange(niceTextBox.value)}>Add message</button>
                        </label>
                        <br/>
                        <ul>

                        </ul> */}

                        <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    console.log(welcomeTextBox.value);
                                    handleWelcomeListChange(welcomeTextBox.value)
                                    welcomeTextBox.value = "";
                                }}>
                            <label>
                                How do you want your avatar to greet you?
                                <input 
                                    type='text'
                                    id='welcomeTextBox'
                                    name='welcomeTextBox'
                                    ref={(node) => {welcomeTextBox = node;}}> 
                                </input>
                                <button type="submit">Add message</button>
                            </label>
                        </form>
                        <br/>
                        {welcomeList && <ul>
                            {welcomeList.map(e => {
                                return (<li key={e}> {e} </li>);
                            })} </ul>}


                        <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    console.log(niceTextBox.value);
                                    handleNiceListChange(niceTextBox.value)
                                    niceTextBox.value = ""
                                }}>
                            <label>
                                What do you want the avatar to say when you complete a task?
                                <input 
                                    type='text'
                                    id='niceTextBox'
                                    name='niceTextBox'
                                    ref={(node) => {niceTextBox = node;}}> 
                                </input>
                                <button type="submit">Add message</button>
                            </label>
                        </form>
                        <br/>
                        {niceList && <ul>
                            {niceList.map(e => {
                                return (<li key={e}> {e} </li>);
                            })} </ul>}

                        <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    console.log(meanTextBox.value);
                                    handleMeanListChange(meanTextBox.value)
                                    meanTextBox.value = ""
                                }}>
                            <label>
                                What do you want the avatar to say when you don't complete a task?
                                <input 
                                    type='text'
                                    id='meanTextBox'
                                    name='meanTextBox'
                                    ref={(node) => {meanTextBox = node;}}> 
                                </input>
                                <button type="submit">Add message</button>
                            </label>
                        </form>
                        <br/>
                        {meanList && <ul>
                            {meanList.map(e => {
                                return (<li key={e}> {e} </li>);
                            })} </ul>}


                        {/* <label>
                            Building Type:
                            <select
                                onChange={(e) => handleChange(e)}
                                id='buildingType'
                                name='buildingType'
                            >
                                <option value="ADMIN">ADMIN</option>
                                <option value="EDUCATION">EDUCATION</option>
                                <option value="GARDEN">GARDEN</option>
                                <option value="HOME">HOME</option>
                                <option value="PARK">PARK</option>
                                <option value="STORE">STORE</option>
                            </select>
                        </label>
                        <label>
                            XP:
                            <input
                                onChange={(e) => handleChange(e)}
                                id='xp'
                                name='xp'
                                placeholder='XP...'
                            />
                        </label>
                        <label>
                            Max XP:
                            <input
                                onChange={(e) => handleChange(e)}
                                id='xpMax'
                                name='xpMax'
                                placeholder='Max XP...'
                            />
                        </label>
                        <label>
                            Level:
                            <input
                                onChange={(e) => handleChange(e)}
                                id='level'
                                name='level'
                                placeholder='Level...'
                            />
                        </label> */}
                    </div>
                    <button onClick={CreateAvatar}>Create Avatar</button>
                    {/* <button onClick={GetAvatar}>Get Avatar</button> */}
                </div>
            </div>}
            
        {/* {createdAvatar && !err && <Building id={createdAvatar._id} />} */}
        {err && <Error error={errData} />}
    </div>
    );
}

export default CreateAvatar;
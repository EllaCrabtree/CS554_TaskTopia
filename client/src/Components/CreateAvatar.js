import { useState } from 'react';
import Building from './Building';
import Avatar from './Avatar';
import axios from 'axios';
import Error from './Error';

function CreateAvatar(props) {

    const [formData, setFormData] = useState({ buildingType: '' });
    const [imageData, setImageData] = useState(null);
    const [createdAvatar, setCreated] = useState(undefined);
    const [err, setErr] = useState(false);
    const [errData, setErrData] = useState(undefined);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

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

    // const readImageBinary = (img) => {
    //     const reader = new FileReader();

    //     reader.onloadend = () => {
    //         setImageData(reader.result);
    //         console.log(reader.result)
    //     }

    //     reader.readAsDataURL(new Blob([img]));

    // }

    async function CreateAvatar() {
        try {

            console.log(formData);

            //Note: the header is necessary to pass the form data, including the image, to the backend
            //Otherwise, Axios may throw a 413 due to the file size
            console.log('This is the form data being passed')
            console.log(formData)
            const { data } = await axios.post(`http://localhost:4000/avatar/`, formData, {headers: {"content-type": "multipart/form-data"}});

            // setCreated(data);
            // setImageData(formData.img)
            // console.log('This is the img')
            console.log(formData.img)
        } catch (e) {
            setErr(true);
            setErrData(e);
            console.log(e);
        }
    };

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
    };

    return (<div>
        {!createdAvatar && !err &&
            <div>
                <div className='add'>
                    <div className='input-selection'>
                        <label>
                            Upload Image:
                            <input 
                                onChange={(e) => handleImageChange(e)}
                                type="file" 
                                id="img" 
                                name="img" 
                                accept="image/*"
                                encType="multipart/form-data" />
                        </label>
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
                    <button onClick={GetAvatar}>Get Avatar</button>
                </div>
                {imageData != null && <img src={imageData} alt='Odin' width='500' height='500'/>}
            </div>}
        {/* {createdAvatar && !err && <Building id={createdAvatar._id} />} */}
        {err && <Error error={errData} />}
    </div>
    );
}

export default CreateAvatar;
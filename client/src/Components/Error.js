import React from 'react';
import '../App.css';

const Error = (props) => {
    const errorInfo = props.error;
    return (
        <div>
            <h1>{errorInfo.response.status}: {errorInfo.response.statusText}</h1>
            <p>{errorInfo.response.data.error}</p>
        </div>
    )
};

export default Error;

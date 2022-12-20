import React from 'react';
import '../App.css';

const Error = (props) => {
    const errorInfo = props.error;
    return (
        <div>
            {(errorInfo.code === 'ERR_NETWORK') &&
                < div >
                    <h1>404</h1>
                    <p>{errorInfo.code}</p>
                </div >}
            {(errorInfo.code !== 'ERR_NETWORK') &&
                < div >
                    {errorInfo && errorInfo.response && errorInfo.response.status && errorInfo.response.statusText && <h1>{errorInfo.response.status}: {errorInfo.response.statusText}</h1>}
                    {errorInfo && errorInfo.response && errorInfo.response.data && errorInfo.response.data.error && <p>{errorInfo.response.data.error}</p>}
                </div >}
        </div>
    )
};

export default Error;

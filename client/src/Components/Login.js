import React, {useContext} from 'react';
import SocialSignIn from './SocialSignIn';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../firebase/Auth';

import {
    doSignInWithEmailandPassword,
    doPasswordReset,
} from '../firebase/FirebaseFunctions';

function Login(){
    const {currentUser} = useContext(AuthContext);

    const handleLogin = async (event) => {
        event.preventDefault();
        let {email, password} = event.target.elements;
        console.log(event);
    
        try {
            const result = await doSignInWithEmailandPassword(email.value, password.value);

            if(result.errorMessage){
                alert('Error: ' + result.errorMessage);
            }
        } catch (error) {
            console.log("caught error");
            alert(error);
        }
    }; 

    const passwordReset = (event) => {
        event.preventDefault();
        let email = document.getElementById('email').value;
        if (email) {
          doPasswordReset(email);
          alert('Password reset email was sent');
        } else {
          alert('Please enter an email address below before you click the forgot password link');
        }
    };

    if (currentUser) {
        return <Navigate to='/' />;
    }

    return(
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>
                        Email:
                        <input
                            name='email'
                            id='email'
                            type='email'
                            placeholder='Email'
                            required
                        />
                    </label>
                </div>
                <div className='form-group'>
                    <label>
                        Password:
                        <input
                            className='form-control'
                            id='password'
                            name='password'
                            type='password'
                            placeholder='Password'
                            autoComplete='off'
                            required
                        />
                    </label>
                </div>
                <button type='submit'>Login</button>

                <button className='forgotPassword' onClick={passwordReset}>
                    Forgot Password
                </button>
            </form>
            <br />
            <SocialSignIn />
        </div>
    );
}

export default Login;
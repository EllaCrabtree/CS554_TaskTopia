import React, {useContext} from 'react';
import SocialSignIn from './SocialSignIn';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../firebase/Auth';

import {
    doSignInWithEmailAndPassword,
    doPasswordReset,
} from '../firebase/FirebaseFunctions';

function Login(){
    const {currentUser} = useContext(AuthContext);
    const handleLogin = async (event) => {
        event.preventDefault();
        let {email, password} = event.target.elements;
  
        try {
            const result = await doSignInWithEmailAndPassword(email.value, password.value);

            if(result.errorMessage){
                alert(result.errorMessage);
            }

        } catch (error) {
            alert(error);
        }
    };
  
    const passwordReset = async (event) => {
        event.preventDefault();
        let email = document.getElementById('email').value;
        if (email) {
            let result = await doPasswordReset(email);
            if(result.success){
              alert('Password reset email was sent');
            }else{
              alert(result.errorMessage);
            }
        } else {
            alert(
            'Please enter an email address below before you click the forgot password link'
            );
        }
    };
    if (currentUser) {
      return <Navigate to='/' />;
    }
    return (
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
          <div>
            <label>
              Password:
              <input
                name='password'
                type='password'
                placeholder='Password'
                autoComplete='off'
                required
              />
            </label>
          </div>
          <button type='submit'>Login</button>
  
          <button onClick={passwordReset}>
            Forgot Password
          </button>
        </form>
  
        <br />
        <SocialSignIn />
      </div>
    );
}

export default Login;
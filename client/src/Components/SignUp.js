import React, {useContext, useState} from 'react';
import { Navigate } from 'react-router-dom';
import {doCreateUserWithEmailandPassword} from '../firebase/FirebaseFunctions';
import {AuthContext} from '../firebase/Auth';
import SocialSignIn from './SocialSignIn';

function SignUp(){
    const {currentUser} = useContext(AuthContext);
    const [pwMatch, setPwMatch] = useState('');
    const handleSignUp = async (e) => {
      e.preventDefault();
      const {displayName, email, passwordOne, passwordTwo} = e.target.elements;
      if (passwordOne.value !== passwordTwo.value) {
        setPwMatch('Passwords do not match');
        return false;
      }
  
      try {
        await doCreateUserWithEmailandPassword(
          email.value,
          passwordOne.value,
          displayName
        );
      } catch (error) {
        alert(error);
      }
    };
  
    if (currentUser) {
      return <Navigate to='/home' />;
    }

    return(
        <div>
            <h1>Sign Up</h1>
            {pwMatch && <h4>{pwMatch}</h4>}
            <form onSubmit={handleSignUp}>
                <div>
                    <label>
                        Name:
                        <input
                            required
                            name='displayName'
                            type='text'
                            placeholder='Name'
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input
                            required
                            name='email'
                            type='email'
                            placeholder='Email'
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input
                            id='passwordOne'
                            name='passwordOne'
                            type='password'
                            placeholder='Password'
                            autoComplete='off'
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Confirm Password:
                        <input
                            name='passwordTwo'
                            type='password'
                            placeholder='Confirm Password'
                            autoComplete='off'
                            required
                        />
                    </label>
                </div>
                <button id='submitButton' name='submitButton' type='submit'>
                    Sign Up
                </button>
            </form>
            <br />
            <SocialSignIn />
        </div>
    );

}

export default SignUp;
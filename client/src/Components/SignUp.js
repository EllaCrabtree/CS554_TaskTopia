import React, {useContext, useState} from 'react';
import { Navigate } from 'react-router-dom';
import {doCreateUserWithEmailandPassword} from '../firebase/FirebaseFunctions';
import {AuthContext} from '../firebase/Auth';
import SocialSignIn from './SocialSignIn';
import axios from 'axios';

function SignUp(){
    const {currentUser} = useContext(AuthContext);
    const [pwMatch, setPwMatch] = useState('');

    async function CreateUser(firstName, lastName, username, password, email) {
        let user = null;
        try {
            await axios.post(`http://localhost:4000/signup/`, {
                firstName: firstName,
                lastName: lastName,
                username: username, 
                password: password,
                email: email
            })
            .then((result) => {
                user = result.data;
            })
        } catch (e) {
            console.log(e);
        }

        return user;
    }

    const handleSignUp = async (e) => {
      e.preventDefault();
      const {firstName, lastName, username, email, passwordOne, passwordTwo} = e.target.elements;
      if (passwordOne.value !== passwordTwo.value) {
        setPwMatch('Passwords do not match');
        return false;
      }
  
      try {
        let result = await doCreateUserWithEmailandPassword(
          email.value,
          passwordOne.value,
        );

        if(!result.errorMessage){
            let addedUser = await CreateUser(firstName.value, lastName.value, username.value, passwordOne.value, email.value);
            if(!addedUser){
                alert('Could not successfully upload user to database')
            }
        }else{
            alert(result.errorMessage);
        }

      } catch (error) {
        alert(error);
      }
    };
  
    if (currentUser) {
      return <Navigate to='/' />;
    }

    return(
        <div>
            <h1>Sign Up</h1>
            {pwMatch && <h4>{pwMatch}</h4>}
            <form onSubmit={handleSignUp}>
                <div>
                    <label>
                        First Name:
                        <input 
                            required
                            name='firstName'
                            type='text'
                            placeholder='First Name'
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Last Name:
                        <input
                            required
                            name='lastName'
                            type='text'
                            placeholder='Last Name'
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
                        Username:
                        <input 
                            required
                            name='username'
                            type='text'
                            placeholder='Username'
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
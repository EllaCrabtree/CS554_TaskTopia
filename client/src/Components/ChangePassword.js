import React, { useContext, useState } from 'react';
import { AuthContext } from '../firebase/Auth';
import { doChangePassword } from '../firebase/FirebaseFunctions';

function ChangePassword() {
  const { currentUser } = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState('');

  const submitForm = async (event) => {
    event.preventDefault();
    const { currentPassword, newPasswordOne, newPasswordTwo } =
      event.target.elements;

    console.log(currentPassword);

    if (newPasswordOne.value !== newPasswordTwo.value) {
      setPwMatch('New Passwords do not match, please try again');
      return false;
    }

    try {
      let result = await doChangePassword(
        currentUser.email,
        newPasswordOne.value
      );

      if (result.errorMessage) {
        alert(result.errorMessage);
      } else {
        alert('Password has been changed, you will now be logged out');
      }
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser.providerData[0].providerId === 'password') {
    return (
      <div>
        {pwMatch && <h4 className='error'>{pwMatch}</h4>}
        <h2>Change Password</h2>
        <form onSubmit={submitForm}>
          <div className='form-group'>
            <label>
              Current Password:
              <input
                name='currentPassword'
                id='currentPassword'
                type='password'
                placeholder='Current Password'
                autoComplete='off'
                required
              />
            </label>
          </div>
          <div>
            <p>Password must meet all of the following:</p>
            <ul>
              <li className='liNoDot'>Must be at least 8 characters</li>
              <li className='liNoDot'>Must include a special character ($ @ * % # = +)</li>
              <li className='liNoDot'>Must include a number</li>
            </ul>
          </div>
          <div className='form-group'>
            <label>
              New Password:
              <input
                name='newPasswordOne'
                id='newPasswordOne'
                type='password'
                placeholder='Password'
                autoComplete='off'
                required
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Confirm New Password:
              <input
                name='newPasswordTwo'
                id='newPasswordTwo'
                type='password'
                placeholder='Confirm Password'
                autoComplete='off'
                required
              />
            </label>
          </div>

          <button className="basicButton" type='submit'>Change Password</button>
        </form>
        <br />
      </div>
    );
  } else {
    return (
      <div>
        <h2>
          You are signed in using a Social Media Provider, You cannot change
          your password
        </h2>
      </div>
    );
  }
}

export default ChangePassword;
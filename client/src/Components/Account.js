import React from 'react';
import SignOutButton from './SignOut';
import ChangePassword from './ChangePassword';

function Account(){

    return(
        <div className="formDiv">
            <header>
                <h1>Account Page</h1>
            </header>
            <ChangePassword />
            <SignOutButton />
        </div>
    );

}

export default Account;
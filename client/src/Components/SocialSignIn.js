import React from 'react';
import {doGoogleSignIn} from '../firebase/FirebaseFunctions';

const SocialSignIn = () => {
  const socialSignOn = async (provider) => {
    try {
      await doGoogleSignIn(provider);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <img
        onClick={() => socialSignOn('google')}
        alt='google signin'
        src='https://companieslogo.com/img/orig/GOOG-0ed88f7c.png?t=1633218227'
        height='50px'
        width='50px'
      />
      <p className="randomText">Sign in With Google</p>
    </div>
  );
};

export default SocialSignIn;
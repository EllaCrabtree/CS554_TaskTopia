import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import SignOutButton from './SignOut';

const Navigation = () => {
  const { currentUser } = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  return (
    <nav>
      <ul>
        <li className="App-link">
          <NavLink to='/'>Home</NavLink>
        </li>
        <li className="App-link">
          <NavLink to='/account'>Account</NavLink>
        </li>
        <li className="App-link">
          <NavLink to='/buildings'>Buildings</NavLink>
        </li>
        <li>
          <SignOutButton />
        </li>
      </ul>
    </nav>
  );
};

const NavigationNonAuth = () => {
  return (
    <nav>
      <ul>
        <li className="App-link">
          <NavLink to='/'>Home</NavLink>
        </li>
        <li className="App-link">
          <NavLink to='/login'>Login</NavLink>
        </li>
        <li className="App-link">
          <NavLink to='/signUp'>Sign-Up</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
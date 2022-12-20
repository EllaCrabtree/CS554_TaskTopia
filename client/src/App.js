import './App.css';
import HomePage from './Components/HomePage';
import Building from './Components/Building';
import UserBuildings from './Components/UsersBuildings';
import Badges from './Components/AllBadges';
import Task from './Components/Task';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import ChangePassword from './Components/ChangePassword';
import Account from './Components/Account';
import {AuthProvider} from './firebase/Auth';
import PrivateRoute from './Components/PrivateRoute';
import Navigation from './Components/Navigation';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <section className='App-header'>
            <Navigation />
          </section>
          <div className='App-body'>
            <HomePage />
            <Routes>
                <Route element={<PrivateRoute/>}>
                  <Route exact path='/task/:buildingId/:taskId' element={<Task />}/>
                  <Route exact path='/buildings/:buildingId' element={<Building />}/>
                  <Route path = '/changepassword' element={<ChangePassword />}/>
                  <Route path = '/account' element={<Account />}/>
                </Route>

                <Route path = '/login' element={<Login />}/>
                <Route path = '/signUp' element={<SignUp />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

import './App.css';
import HomePage from './Components/HomePage';
import Building from './Components/Building';
import UserBuildings from './Components/UsersBuildings';
import Badges from './Components/AllBadges';
import Task from './Components/Task';
import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <section className='App-header'>
          <Link className='App-link' to='/login'>
            Login
          </Link>
          <Link className='App-link' to='/signUp'>
            Sign Up
          </Link>
        </section>
        <div className='App-body'>
          <Routes>
            <Route exact path='/' element={<HomePage />} />
            <Route exact path='/buildings/' element={<UserBuildings />} />
            <Route exact path='/buildings/:buildingId' element={<Building />} />
            <Route exact path='/task/:buildingId/:taskId' element={<Task />} />
            <Route exact path='/badges' element={<Badges />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

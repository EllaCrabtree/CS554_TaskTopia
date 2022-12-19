import './App.css';
import HomePage from './Components/HomePage';
import Building from './Components/Building';
import Task from './Components/Task';
import CreateAvatar from './Components/CreateAvatar';
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
          {/* <HomePage /> */}
          <Routes>
            <Route exact path='/buildings/:buildingId' element={<Building />} />
            <Route exact path='/task/:buildingId/:taskId' element={<Task />} />
            <Route exact path='/avatarTestForm' element={<CreateAvatar />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

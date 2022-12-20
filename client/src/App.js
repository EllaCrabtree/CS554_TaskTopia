import "./App.css";
import HomePage from "./Components/HomePage";
import Building from "./Components/Building";
import Badges from "./Components/AllBadges";
import Task from "./Components/Task";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import ChangePassword from "./Components/ChangePassword";
import Account from "./Components/Account";
import { AuthProvider } from "./firebase/Auth";
import PrivateRoute from "./Components/PrivateRoute";
import Navigation from "./Components/Navigation";
import UserBuilding from "./Components/UsersBuildings";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <div>
            <Navigation />
          </div>
          <div className="App-body">
            <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route element={<PrivateRoute />}>
                <Route
                  exact
                  path="/task/:buildingId/:taskId"
                  element={<Task />}
                />
                <Route
                  exact
                  path="/buildings/:buildingId"
                  element={<Building />}
                />
                <Route path="/changepassword" element={<ChangePassword />} />
                <Route path="/account" element={<Account />} />
                <Route path="/buildings" element={<UserBuilding />} />
              </Route>

              <Route path="/login" element={<Login />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/buildings" element={<UserBuilding />}></Route>
              <Route exact path="/badges" element={<Badges />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

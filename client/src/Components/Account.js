import React from "react";
import { useEffect, useState } from "react";
import SignOutButton from "./SignOut";
import ChangePassword from "./ChangePassword";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../firebase/Auth";
import { Link } from 'react-router-dom';
import Badge from './Badge';

function Account() {
  const currentUser = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [errData, setErrData] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/private/users/uid/" +
          currentUser.currentUser.uid
        );
        setUserInfo(data);
        setLoading(false);
      } catch (e) {
        setErr(true);
        setErrData(e);
        console.log(e);
      }
    }
    fetchData();
  }, []);

  if (err) {
    alert(errData);
  } else if (loading) {
    return <div>Loading</div>;
  } else {
    let awards = userInfo.awards;
    let buildings = userInfo.buildings;
    let friends = userInfo.friends;
    return (
      <div className="accountPage">
        <header>
          <h1>Account Page</h1>
        </header>

        <div>
          <h2>{userInfo.username}`s stats:</h2>

          <h3>Level: {userInfo.level}</h3>

          <h3>Awards: </h3>
          {awards.length > 0 ? (
            <ul>
              {awards.map((award) => (
                <li className="liNoDot" key={award}>
                  <Badge id={award} />
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no awards :\</p>
          )}

          <h3>Buildings:</h3>
          {buildings.length > 0 ? (
            <ul>
              {buildings.map((building) => (
                <li className="liNoDot" key={building.buildingID}>
                  <Link to={`/buildings/${building.buildingID}`}> {building.name} </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no buildings :\</p>
          )}
        </div>

        <div>
          <h2>{userInfo.username}`s friends:</h2>
          {friends.length > 0 ? (
            <ul>
              {friends.map((friend) => (
                <li className="liNoDot" key={friend}>{friend}</li>
              ))}
            </ul>
          ) : (
            <p>You have no friends :\</p>
          )}
        </div>
        <div className="formDiv">
          <ChangePassword />
        </div>
        <SignOutButton />
      </div >
    );
  }
}

export default Account;

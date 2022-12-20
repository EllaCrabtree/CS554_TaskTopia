import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { doCreateUserWithEmailandPassword } from "../firebase/FirebaseFunctions";
import { AuthContext } from "../firebase/Auth";
import axios from "axios";

function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState("");

  async function CreateUser(
    firstName,
    lastName,
    username,
    password,
    email,
    uid
  ) {
    let user = null,
      errorMessage = null;
    try {
      await axios
        .post(`http://localhost:4000/signup/`, {
          firstName: firstName,
          lastName: lastName,
          username: username,
          password: password,
          email: email,
          uid: uid,
        })
        .then((result) => {
          user = result.data;
        });
    } catch (e) {
      errorMessage = e;
      console.log(e);
    }

    return { user: user, errorMessage: errorMessage };
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { firstName, lastName, username, email, passwordOne, passwordTwo } =
      e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch("Passwords do not match");
      return false;
    }

    if (!passwordOne.value) {
      alert("Error: Password not supplied!");
    } else if (typeof passwordOne.value !== "string") {
      alert("Error: Password must be a string!");
    } else if (passwordOne.value.trim().length === 0) {
      alert("Error: Password cannot be empty or only spaces!");
    } else if (passwordOne.value.trim().length < 8) {
      alert("Error: Password must be 8 characters or longer!");
    } else if (!/[0-9]/.test(passwordOne.value.trim())) {
      alert("Error: Password must contain at least one number!");
    } else if (!/[$@*%#=+]/.test(passwordOne.value.trim())) {
      alert(
        "Error: Password must contain at least one special character! (/[$@*%#=+]/)"
      );
    } else {
      try {
        let result = await doCreateUserWithEmailandPassword(
          email.value,
          passwordOne.value
        );

        if (result.user !== null) {
          let addedUser = await CreateUser(
            firstName.value,
            lastName.value,
            username.value,
            passwordOne.value,
            email.value,
            result.user.uid
          );
          if (!addedUser.errorMessage) {
            console.log(addedUser.user);
          } else {
            alert(addedUser.errorMessage);
          }
        } else {
          alert(result.errorCode + ": " + result.errorMessage);
        }
      } catch (error) {
        alert(error);
      }
    }
  };

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="formDiv">
      <header>
        <h1>Sign Up</h1>
      </header>

      {pwMatch && <h4>{pwMatch}</h4>}
      <form onSubmit={handleSignUp}>
        <div>
          <label>
            First Name:
            <input
              required
              name="firstName"
              type="text"
              placeholder="First Name"
            />
          </label>
        </div>
        <div>
          <label>
            Last Name:
            <input
              required
              name="lastName"
              type="text"
              placeholder="Last Name"
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input required name="email" type="email" placeholder="Email" />
          </label>
        </div>
        <div>
          <label>
            Username:
            <input
              required
              name="username"
              type="text"
              placeholder="Username"
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              id="passwordOne"
              name="passwordOne"
              type="password"
              placeholder="Password"
              autoComplete="off"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Confirm Password:
            <input
              name="passwordTwo"
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              required
            />
          </label>
        </div>
        <button
          id="submitButton"
          name="submitButton"
          type="submit"
          className="basicButton"
        >
          Sign Up
        </button>
      </form>
      <br />
    </div>
  );
}

export default SignUp;

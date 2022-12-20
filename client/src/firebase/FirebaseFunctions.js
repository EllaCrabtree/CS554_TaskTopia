import * as firebase from "firebase/auth";
import { auth } from "./Firebase";
//import axios from "axios";

const authFirebase = auth;
const googleProvider = new firebase.GoogleAuthProvider();

async function doCreateUserWithEmailandPassword(email, password) {
  let user = null,
    errorCode = null,
    errorMessage = null;
  await firebase
    .createUserWithEmailAndPassword(authFirebase, email, password)
    .then((userCredential) => {
      user = userCredential.user;
    })
    .catch((error) => {
      errorCode = error.code;
      errorMessage = error.message;
    });

  return { user: user, errorCode: errorCode, errorMessage: errorMessage };
}

async function doChangePassword(email, newPassword) {
  const user = authFirebase.currentUser;
  let success = null;
  let errorMessage = null;

  if (user) {
    await firebase
      .updatePassword(user, newPassword)
      .then(() => {
        success = true;
      })
      .catch((error) => {
        success = false;
        errorMessage = error.message;
      });
    await doSignOut();
  } else {
    success = false;
    errorMessage = "No user is currently logged in";
  }

  return { success: success, errorMessage: errorMessage };
}

async function doSignInWithEmailAndPassword(email, password) {
  let user = null,
    errorCode = null,
    errorMessage = null;

  await firebase
    .signInWithEmailAndPassword(authFirebase, email, password)
    .then((userCredential) => {
      user = userCredential.user;
    })
    .catch((error) => {
      errorCode = error.code;
      errorMessage = error.message;
    });

  return { user: user, errorCode: errorCode, errorMessage: errorMessage };
}

async function doGoogleSignIn() {
  let email = null;
  await firebase
    .signInWithPopup(authFirebase, googleProvider)
    .then((result) => {
      let user = result.user;
      email = user.email;
      console.log("user email: " + email);
      let credential = firebase.GoogleAuthProvider.credentialFromResult(result);
      console.log(credential);
    })
    .catch((error) => {
      let credential = firebase.GoogleAuthProvider.credentialFromError(error);
      throw "Error: " + credential;
    });

  await doCreateUserWithEmailandPassword(email, "password").then();
  //CreateUser("null", "null", user.email, "null", "null", userAdded.uid);
}

// async function CreateUser(firstName, lastName, username, password, email, uid) {
//   try {
//     await axios
//       .post(`http://localhost:4000/signup/`, {
//         firstName: firstName,
//         lastName: lastName,
//         username: username,
//         password: password,
//         email: email,
//         uid: uid,
//       })
//       .then((result) => {
//         let user = result.data;
//         console.log(user);
//       });
//   } catch (e) {
//     console.log(e);
//   }
// }

async function doPasswordReset(email) {
  let success = null,
    errorMessage = null;

  await firebase
    .sendPasswordResetEmail(authFirebase, email)
    .then(() => {
      success = true;
    })
    .catch((error) => {
      errorMessage = error.message;
    });

  return { success: success, errorMessage: errorMessage };
}

async function deleteUser() {
  const user = authFirebase.currentUser();
  let success = null,
    errorMessage = null;

  await firebase
    .deleteUser(user)
    .then(() => {
      success = true;
      doSignOut();
    })
    .catch((error) => {
      errorMessage = error.errorMessage;
    });

  return { success: success, errorMessage: errorMessage };
}

async function doSignOut() {
  let success = null,
    errorMessage = null;

  await firebase
    .signOut(authFirebase)
    .then(() => {
      success = null;
    })
    .catch((error) => {
      errorMessage = error.errorMessage;
    });

  return { success: success, errorMessage: errorMessage };
}

export {
  doCreateUserWithEmailandPassword,
  doChangePassword,
  doSignInWithEmailAndPassword,
  doGoogleSignIn,
  doPasswordReset,
  deleteUser,
  doSignOut,
};

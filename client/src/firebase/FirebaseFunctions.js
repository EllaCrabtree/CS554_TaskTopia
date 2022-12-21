import * as firebase from "firebase/auth";
import { auth } from "./Firebase";

const authFirebase = auth;

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
  doPasswordReset,
  deleteUser,
  doSignOut,
};

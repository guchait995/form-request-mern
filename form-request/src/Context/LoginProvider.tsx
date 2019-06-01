import React, { useState, useEffect } from "react";
import LoginContext from "./LoginContext";
import { getAuth } from "../Dao/FirebaseDao";
import { Redirect, Route } from "react-router-dom";
import Login from "../Pages/Login";
import { openSnackbar } from "../Components/CustomSnackbar";
import {
  LOGIN_EMAIL_NOT_FOUND,
  SNACKBAR_TIMEOUT,
  LOGIN_FAILED_MESSAGE,
  SIGNUP_EMAIL_ALREADY_FOUND,
  WEAK_PASSWORD_MESSAGE
} from "../AppConstants";
import {
  initSocketUsername,
  addExtraSignupData,
  socket
} from "../Dao/MongoDao";

export interface LoginInfo {
  user: any;
  isLoggedIn: boolean | null;
  userConfigFetched: boolean | null;
}

export default function LoginProvider(props) {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    user: null,
    isLoggedIn: null,
    userConfigFetched: null
  });
  const loginWithEmailAndPassword = async (email, password) => {
    getAuth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log("Successfully Logged In");
      })
      .catch(err => {
        console.error(err);
        if (err.code === "auth/user-not-found")
          openSnackbar({
            message: LOGIN_EMAIL_NOT_FOUND,
            timeout: SNACKBAR_TIMEOUT
          });
        else
          openSnackbar({
            message: LOGIN_FAILED_MESSAGE,
            timeout: SNACKBAR_TIMEOUT
          });
      });
  };

  const signUpWithEmailAndPassword = async (email, password, department) => {
    // console.log("signup called");
    getAuth()
      .createUserWithEmailAndPassword(email, password)
      .then(firebaseUser => {
        if (firebaseUser && firebaseUser.user) {
          console.log(firebaseUser.user);
          addExtraSignupData({
            email: email,
            password: password,
            department: department,
            uid: firebaseUser.user.uid
          });
        }
      })
      .catch(err => {
        console.error(err);
        // if (err.code === "auth/email-already-in-use") {
        //   openSnackbar({
        //     message: SIGNUP_EMAIL_ALREADY_FOUND,
        //     timeout: SNACKBAR_TIMEOUT
        //   });
        // }
        if (err.code === "auth/weak-password") {
          openSnackbar({
            message: WEAK_PASSWORD_MESSAGE,
            timeout: SNACKBAR_TIMEOUT
          });
        }
      });
  };
  const signOut = async () => {
    getAuth()
      .signOut()
      .then(res => {
        console.log("successfully signed out");
      })
      .catch(err => {
        console.error(err);
      });
  };
  const setLoginDetails = loginDetails => {
    if (loginDetails.user && loginDetails.user.email) {
      var email = loginDetails.user.email;
      initSocketUsername(email);
    }
    setLoginInfo(loginDetails);
  };
  return (
    <LoginContext.Provider
      value={{
        state: { loginInfo },
        actions: {
          loginWithEmailAndPassword,
          signUpWithEmailAndPassword,
          setLoginDetails,
          signOut
        }
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
}

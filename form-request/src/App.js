import React, { useContext, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Link,
  HashRouter,
  Switch
} from "react-router-dom";
import "./Stylesheet/styles.css";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import LoginContext from "./Context/LoginContext";
import { Redirect } from "react-router-dom";
import LoginProvider from "./Context/LoginProvider";
import Approval from "./Pages/RequestApproval";
import RequestApproval from "./Pages/RequestApproval";
import Pending from "./Pages/Pending";
import Approved from "./Pages/Approved";
import Signup from "./Pages/Signup";
import { getAuth } from "./Dao/FirebaseDao";
import CustomSnackbar from "./Components/CustomSnackbar";
import CustomBootDialog from "./Components/CustomBootDialog";
import LoadingPage from "./Components/LoadingPage";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { initSocketUsername, socket } from "./Dao/MongoDao";
// import { initSockets } from "./Dao/MongoDao";

export default function App() {
  const theme = createMuiTheme({
    palette: {
      primary: { main: "#3c894a" }, // Purple and green play nicely together.
      secondary: { main: "#c94b0c" },
      green: { main: "#35cc53" }
    },
    typography: {
      useNextVariants: true
    }
  });
  return (
    <LoginProvider>
      <MuiThemeProvider theme={theme}>
        <CustomSnackbar />
        <CustomBootDialog />
        <Router>
          <Switch>
            <Route exact path="/" component={LoginWrapper} />
            <Route path="/signup" component={SignWrapper} />
            <PrivateRoute path="/Home" component={Home} />
            <PrivateRoute
              path="/RequestForApproval"
              component={RequestApproval}
            />
            <PrivateRoute path="/Pending" component={Pending} />
            <PrivateRoute path="/Approved" component={Approved} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    </LoginProvider>
  );
}
function SignWrapper(props) {
  const {
    state: { loginInfo },
    actions: { setLoginDetails }
  } = useContext(LoginContext);
  useEffect(() => {
    var isMounted = false;
    if (!isMounted) {
      isMounted = true;
      // initSockets();
      getAuth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          setLoginDetails({
            ...loginInfo,
            isLoggedIn: true,
            user: firebaseUser,
            userDetails: { email: firebaseUser.email }
          });
        } else {
          setLoginDetails({
            ...loginInfo,
            isLoggedIn: false,
            user: null,
            userDetails: null
          });
        }
      });
    }
  }, []);
  if (loginInfo && loginInfo.isLoggedIn && loginInfo.user) {
    return <Redirect to="/Home" />;
  }
  if (loginInfo && loginInfo.isLoggedIn === false) {
    return <Signup {...props} />;
  }
  return <LoadingPage />;
}
function LoginWrapper(props) {
  const {
    state: { loginInfo },
    actions: { loginWithEmailAndPassword, setLoginDetails }
  } = useContext(LoginContext);
  useEffect(() => {
    var isMounted = false;
    if (!isMounted) {
      isMounted = true;
      getAuth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          setLoginDetails({
            ...loginInfo,
            isLoggedIn: true,
            user: firebaseUser,
            userDetails: { email: firebaseUser.email }
          });
        } else {
          setLoginDetails({
            ...loginInfo,
            isLoggedIn: false,
            user: null,
            userDetails: null
          });
        }
      });
    }
  }, []);
  if (loginInfo && loginInfo.isLoggedIn && loginInfo.user) {
    return <Redirect to="/Home" />;
  }
  if (loginInfo && loginInfo.isLoggedIn === false) {
    return <Login {...props} />;
  }
  return <LoadingPage />;
}

function PrivateRoute({ component: Component, ...rest }) {
  const {
    state: { loginInfo },
    actions: { loginWithEmailAndPassword, setLoginDetails }
  } = useContext(LoginContext);
  useEffect(() => {
    var isMounted = false;
    if (!isMounted) {
      isMounted = true;
      getAuth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          setLoginDetails({
            ...loginInfo,
            isLoggedIn: true,
            user: firebaseUser,
            userDetails: { email: firebaseUser.email }
          });
        } else {
          setLoginDetails({
            ...loginInfo,
            isLoggedIn: false,
            user: null,
            userDetails: null
          });
        }
      });
    }
  }, []);
  return (
    <Route
      {...rest}
      render={props => {
        if (loginInfo && loginInfo.isLoggedIn && loginInfo.user) {
          return <Component {...props} />;
        }
        if (loginInfo && loginInfo.isLoggedIn === false) {
          return <Login {...props} />;
        }
        return <LoadingPage />;
      }}
    />
  );
}

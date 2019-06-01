import React, { useContext, useState } from "react";
import LoginContext from "../Context/LoginContext";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { NavLink } from "react-router-dom";
import {
  FormControl,
  TextField,
  InputAdornment,
  IconButton,
  Button
} from "@material-ui/core";
import { isValidEmail } from "../Utils/Util";
export default function Login(props) {
  const {
    state: { loginInfo },
    actions: { loginWithEmailAndPassword, setLoginDetails }
  } = useContext<any>(LoginContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleLogin = () => {
    loginWithEmailAndPassword(email, password);
  };
  return (
    <div className="centre-box">
      <div className="box-heading">LOGIN</div>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <FormControl fullWidth>
          <TextField
            id="outlined-email-input"
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            margin="normal"
            variant="outlined"
            onChange={value => {
              setEmail(value.currentTarget.value);
            }}
            error={email != null ? !isValidEmail(email) : false}
            helperText={
              email != null
                ? !isValidEmail(email)
                  ? "Please enter a valid email"
                  : null
                : null
            }
          />
          <TextField
            label="Password"
            margin="normal"
            type={showPassword ? "text" : "password"}
            onChange={value => {
              setPassword(value.currentTarget.value);
            }}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  >
                    {!showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button variant="contained" color="primary" type="submit">
            Login
          </Button>
        </FormControl>
      </form>
      <NavLink to="/signup">SIGNUP</NavLink>
    </div>
  );
}

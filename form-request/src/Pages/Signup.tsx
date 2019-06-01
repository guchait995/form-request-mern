import React, { useState, useContext, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { NavLink, Redirect } from "react-router-dom";

import {
  TextField,
  FormControl,
  InputAdornment,
  IconButton,
  Button,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem
} from "@material-ui/core";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import LoginContext from "../Context/LoginContext";
import Department from "../Models/Department";
import { isValidEmail } from "../Utils/Util";
import { socket } from "../Dao/MongoDao";

function Signup() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [department, setDepartment] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [departmentList, setDepartmentList] = useState<string[]>([]);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(
    false
  );
  const {
    state: { loginInfo },
    actions: { signUpWithEmailAndPassword, setLoginDetails }
  } = useContext<any>(LoginContext);
  let isMounted = false;
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
      socket.emit("get_all_departments");
      socket.on("fetch_all_departments", fetched_departments => {
        setDepartmentList(fetched_departments);
      });
    }
  }, []);
  const handleSignUp = () => {
    // console.log(email, password, department);
    signUpWithEmailAndPassword(email, password, department);
  };
  return (
    <div className="centre-box">
      <div className="box-heading">SIGN UP</div>

      <form
        onSubmit={e => {
          e.preventDefault();
          handleSignUp();
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
            error={email != null ? !isValidEmail(email) : false}
            helperText={
              email != null
                ? !isValidEmail(email)
                  ? "Please enter a valid email"
                  : null
                : null
            }
            onChange={value => {
              setEmail(value.currentTarget.value);
            }}
          />
          <FormControl variant="outlined" margin="normal">
            <InputLabel htmlFor="outlined-age-native-simple">
              Department
            </InputLabel>
            <Select
              native
              value={department ? department : ""}
              onChange={e => {
                var dept: any = e.currentTarget.value;
                if (dept) {
                  setDepartment(dept);
                }
              }}
              input={
                <OutlinedInput
                  name="department"
                  labelWidth={100}
                  id="outlined-age-native-simple"
                />
              }
            >
              <option value="" />

              {departmentList
                ? departmentList.map((department, key) => {
                    return (
                      <option value={department} key={key}>
                        {department}
                      </option>
                    );
                  })
                : null}
            </Select>
          </FormControl>
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            onChange={value => {
              setPassword(value.currentTarget.value);
            }}
            variant="outlined"
            margin="normal"
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
            error={
              password != null && confirmPassword != null
                ? password != confirmPassword
                : false
            }
            helperText={
              password != null && confirmPassword != null
                ? password != confirmPassword
                  ? "Passwords do not match"
                  : ""
                : false
            }
          />
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            margin="normal"
            onChange={value => {
              setConfirmPassword(value.currentTarget.value);
            }}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={() => {
                      setShowConfirmPassword(!showConfirmPassword);
                    }}
                  >
                    {!showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={
              password != null && confirmPassword != null
                ? password != confirmPassword
                : false
            }
            helperText={
              password != null && confirmPassword != null
                ? password != confirmPassword
                  ? "Passwords do not match"
                  : ""
                : false
            }
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={
              !(password != null && confirmPassword != null
                ? password == confirmPassword
                  ? isValidEmail(email) && department != null
                  : false
                : false)
            }
            onClick={() => {
              handleSignUp();
            }}
          >
            SIGNUP
          </Button>
        </FormControl>
      </form>
      <NavLink to="/">LOGIN</NavLink>
    </div>
  );
}
export default withRouter(Signup);
// const SpecialButton = withRouter(({ history, path, text,email,password,department }) => {
//   const {
//     actions: { signUpWithEmailAndPassword }
//   } = useContext<any>(LoginContext);
//   return (
//     <Button
//       variant="contained"
//       color="primary"
//       type="submit"
//       onClick={() => { signUpWithEmailAndPassword(email,password,department,history) }}
//     >
//       {text}
//     </Button>
//   )
// });

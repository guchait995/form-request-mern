import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Button
} from "@material-ui/core";
import Department from "../Models/Department";
import User from "../Models/User";
import Request from "../Models/Request";
import { REQUEST_PENDING } from "../AppConstants";
import LoginContext from "../Context/LoginContext";
import { openSnackbar } from "./CustomSnackbar";
import { addRequest, socket } from "../Dao/MongoDao";
export default function FormView() {
  const [departmentList, setDepartmentList] = useState<[]>();
  const [department, setDepartment] = useState();
  const [userList, setUserList] = useState<User[] | null>();
  const [user, setUser] = useState<User>();
  const {
    state: { loginInfo }
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
  useEffect(() => {
    if (department) {
      setUserList(null);
      socket.emit("get_all_users", department.name);
      socket.on("fetch_specific_users", users => {
        setUserList(users);
      });
    }
  }, [department]);
  const handleRequest = () => {
    if (user && department && loginInfo && loginInfo.user) {
      var dateObj: Date = new Date();
      var request: Request = {
        status: REQUEST_PENDING,
        department: department.name,
        toEmail: user.email,
        fromEmail: loginInfo.user.email,
        time: dateObj.getTime()
      };
      // raisedRequest(request);
      addRequest(request);
      // getRequests();
    }
  };
  return (
    <div>
      <div className="centre-box">
        <div className="box-heading">Raise A Request</div>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleRequest();
          }}
        >
          <FormControl
            variant="outlined"
            margin="normal"
            fullWidth
            disabled={departmentList ? departmentList.length === 0 : true}
          >
            <InputLabel htmlFor="outlined-age-native-simple">
              Department
            </InputLabel>
            <Select
              native
              value={department ? department.name : ""}
              onChange={e => {
                var dept: any = e.currentTarget.value;
                if (dept) {
                  setDepartment({ name: dept, users: null });
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
          <FormControl
            variant="outlined"
            margin="normal"
            fullWidth
            disabled={userList ? userList.length === 0 : true}
          >
            <InputLabel htmlFor="outlined-age-native-simple">Users</InputLabel>
            <Select
              native
              value={user ? user.email : ""}
              onChange={e => {
                var userEmail: any = e.currentTarget.value;
                if (userEmail) {
                  setUser({ email: userEmail });
                }
              }}
              input={
                <OutlinedInput
                  name="user"
                  labelWidth={50}
                  id="outlined-age-native-simple"
                />
              }
            >
              <option value="" />

              {userList
                ? userList.map((user, key) => {
                    return (
                      <option value={user.email} key={key}>
                        {user.email}
                      </option>
                    );
                  })
                : null}
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" type="submit">
            Request
          </Button>
        </form>
      </div>
    </div>
  );
}

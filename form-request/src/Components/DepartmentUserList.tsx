import React, { useEffect, useState } from "react";
import Department from "../Models/Department";

import User from "../Models/User";
import EachUserRow from "./EachUserRow";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "@material-ui/core";
import { socket } from "../Dao/MongoDao";
import SmallLoading from "./SmallLoading";

export default function() {
  const [departmentNames, setDepartmentNames] = useState<string[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  var mydepartments: Department[] = [];
  var isMounted = false;
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
      socket.emit("get_all_users", null);
      socket.on("fetch_all_users", users => {
        setUserList(users);
      });
    }
  }, []);

  return (
    <div className="table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>DEPARTMENT</TableCell>
            <TableCell>USER</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userList
            ? userList.map((user, index) => {
                return <EachUserRow user={user} key={index} />;
              })
            : null}
        </TableBody>
      </Table>
    </div>
  );
}

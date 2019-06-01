import React from "react";

import User from "../Models/User";
import { TableRow, TableCell } from "@material-ui/core";
export default function EachUserRow(props) {
  const user: User = props.user;
  return (
    <TableRow>
      <TableCell>{user.department}</TableCell>
      <TableCell>{user.email}</TableCell>
    </TableRow>
  );
}

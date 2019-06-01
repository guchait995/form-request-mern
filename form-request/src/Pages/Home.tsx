import React from "react";
import Header from "../Components/Header";
import FormView from "../Components/FormView";
import MainBody from "../Components/MainBody";
import DepartmentUserList from "../Components/DepartmentUserList";
import { Button } from "@material-ui/core";

export default function Home() {
  return (
    <MainBody>
      <FormView />
      <DepartmentUserList />
    </MainBody>
  );
}

import Request from "../Models/Request";
import { request } from "http";
import LoginContext from "../Context/LoginContext";
import React, { useContext } from "react";
import {
  openModal,
  openRequestAlertDialog
} from "../Components/CustomBootDialog";
import {
  REQUEST_APPROVED,
  REQUEST_RAISE_FOR_APPROVAL,
  REQUEST_REJECTED,
  SNACKBAR_TIMEOUT,
  PENDING_REQUEST_ADDED_MESSAGE
} from "../AppConstants";
import { openSnackbar } from "../Components/CustomSnackbar";
let currnetUsername = "";
let setNotificationFn;
export const socket = require("socket.io-client")(
  "https://morning-woodland-72857.herokuapp.com/"
);
export const initSocketUsername = username => {
  currnetUsername = username;
  socket.emit("change_username", { username: username });
};

//Listen on new_request
socket.on("new_request", data => {
  if (currnetUsername === data.request.toEmail) {
    openRequestAlertDialog(data, REQUEST_RAISE_FOR_APPROVAL);
  }
});

//Listen on approve_request
socket.on("approve_request", data => {
  if (currnetUsername === data.request.fromEmail) {
    console.log("approved your request");
    openRequestAlertDialog(data, REQUEST_APPROVED);
  }
});

socket.on("rejected_request", data => {
  if (currnetUsername === data.request.fromEmail) {
    console.log("rejected your request");
    openRequestAlertDialog(data, REQUEST_REJECTED);
  }
});
//adds new Request
export const addRequest = (request: Request) => {
  socket.emit("raised_new_request", request);
  openSnackbar({
    message: PENDING_REQUEST_ADDED_MESSAGE,
    timeout: SNACKBAR_TIMEOUT
  });
};
export const approveRequest = (request: Request) => {
  socket.emit("on_approved_request", request);
};
export const rejectRequest = (request: Request) => {
  socket.emit("on_rejected_request", request);
};

export const addExtraSignupData = data => {
  socket.emit("extra_signup_data", data);
};

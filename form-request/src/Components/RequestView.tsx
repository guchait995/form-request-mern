import React, { useContext } from "react";
import Request from "../Models/Request";
import { getStatusFromCode, formatTimeStamp } from "../Utils/Util";
import { REQUEST_PENDING, REQUEST_RAISE_FOR_APPROVAL } from "../AppConstants";
import LoginContext from "../Context/LoginContext";
import { Button } from "@material-ui/core";
import { approveRequest, rejectRequest } from "../Dao/MongoDao";

export default function RequestView(props) {
  const request: Request = props.request;
  const id: string = props.id;
  const viewModel: number = props.viewModel;
  const {
    state: { loginInfo }
  } = useContext<any>(LoginContext);
  const handleApprove = () => {
    approveRequest(request);
  };
  const handleReject = () => {
    //handle Reject
    // rejectRequest(request);
    rejectRequest(request);
  };
  return (
    <div className="each-request">
      <div className="request-status">
        Status :{" "}
        <span>{request.status ? getStatusFromCode(request.status) : ""}</span>
      </div>
      <div className="request-to-email">
        Reciever Email : <span>{request.toEmail}</span>{" "}
      </div>
      <div className="request-from-email">
        Sender Email : <span>{request.fromEmail}</span>
      </div>
      <div className="request-department">
        Department : <span>{request.department}</span>
      </div>
      <div className="request-department">
        Time : <span>{formatTimeStamp(request.time)}</span>
      </div>
      {viewModel === REQUEST_RAISE_FOR_APPROVAL ? (
        <div className="approve-button">
          <Button
            color="secondary"
            onClick={() => {
              handleReject();
            }}
          >
            REJECT
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleApprove();
            }}
          >
            APPROVE
          </Button>
        </div>
      ) : null}
    </div>
  );
}

import React from "react";
import {
  REQUEST_RAISE_FOR_APPROVAL,
  REQUEST_APPROVED,
  REQUEST_REJECTED
} from "../AppConstants";

export default function RequestAlertDialog(props) {
  const { fromEmail, toEmail } = props.request;
  const { type } = props;
  if (type === REQUEST_RAISE_FOR_APPROVAL)
    return (
      <div>
        <div className="notification-header">Notification</div>
        <div className="notification-body">
          {fromEmail} requested to Approve his/her request.
        </div>
      </div>
    );
  else if (type === REQUEST_APPROVED)
    return (
      <div>
        <div className="notification-header">Notification</div>
        <div className="notification-body">
          Congrats!! {toEmail} Accepted your request.
        </div>
      </div>
    );
  else if (type === REQUEST_REJECTED)
    return (
      <div>
        <div className="notification-header">Notification</div>
        <div className="notification-body">
          Sorry!! Your Request was rejected by {fromEmail} .
        </div>
      </div>
    );
  return <div />;
}

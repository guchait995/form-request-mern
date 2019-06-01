import React, { useEffect, useState, useContext } from "react";
import MainBody from "../Components/MainBody";
import Request from "../Models/Request";
import RequestView from "../Components/RequestView";
import LoginContext from "../Context/LoginContext";
import { REQUEST_RAISE_FOR_APPROVAL, REQUEST_PENDING } from "../AppConstants";
import { socket } from "../Dao/MongoDao";
import { getIndex, removeELement } from "../Utils/Util";
import { openModal } from "../Components/CustomBootDialog";
import RequestAlertDialog from "../Components/RequestAlertDialog";

export default function RequestApproval() {
  const [approvalRequestList, setApprovalRequestList] = useState<Request[]>([]);
  const {
    state: { loginInfo }
  } = useContext<any>(LoginContext);
  var isMounted = false;
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
      socket.emit("get_latest_request_for_approval_list");
      socket.on("latest_request_for_approval_list", data => {
        setApprovalRequestList(data);
      });
    }
  }, []);
  var Mounted = false;
  useEffect(() => {
    if (approvalRequestList.length > 0 && !Mounted) {
      Mounted = true;
      socket.on("approve_request", data => {
        var tempList = approvalRequestList.slice(0);
        var tempList1 = removeELement(tempList, data.request);
        if (tempList1) setApprovalRequestList(tempList1);
      });
      socket.on("rejected_request", data => {
        var tempList = approvalRequestList.slice(0);
        var tempList1 = removeELement(tempList, data.request);
        if (tempList1) setApprovalRequestList(tempList1);
      });
      socket.on("new_request", data => {
        if (
          data.request.toEmail &&
          loginInfo.user.email &&
          data.request.toEmail === loginInfo.user.email
        ) {
          var tempList = approvalRequestList.slice(0);
          tempList.push(data.request);
          setApprovalRequestList(tempList);
        }
      });
    }
  }, [approvalRequestList]);
  return (
    <MainBody>
      <div className="centre-box">
        <div className="box-heading">REQUEST FOR APPROVAL</div>
        <div className="request-list">
          {approvalRequestList
            ? approvalRequestList.map((request, key) => {
                return (
                  <RequestView
                    request={request}
                    viewModel={REQUEST_RAISE_FOR_APPROVAL}
                    key={key}
                  />
                );
              })
            : null}
        </div>
      </div>
    </MainBody>
  );
}

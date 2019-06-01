import React, { useEffect, useState, useContext } from "react";
import MainBody from "../Components/MainBody";

import Request from "../Models/Request";
import RequestView from "../Components/RequestView";
import { REQUEST_PENDING, REQUEST_APPROVED } from "../AppConstants";
import { socket } from "../Dao/MongoDao";
import { openModal } from "../Components/CustomBootDialog";
import RequestAlertDialog from "../Components/RequestAlertDialog";
import LoginContext from "../Context/LoginContext";
export default function Approved() {
  const [approvedRequestList, setApprovedRequestList] = useState<Request[]>([]);
  const {
    state: { loginInfo }
  } = useContext<any>(LoginContext);
  var isMounted = false;
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
      socket.emit("get_latest_approved_list");
      socket.on("latest_approved_list", data => {
        setApprovedRequestList(data);
      });
    }
  }, []);
  var Mounted = false;
  useEffect(() => {
    if (approvedRequestList.length > 0 && !Mounted) {
      Mounted = true;
      socket.on("approve_request", data => {
        console.log(loginInfo.user.email);
        console.log(data.request.fromEmail);
        var tempList = approvedRequestList.slice(0);
        tempList.push(data.request);
        setApprovedRequestList(tempList);
      });
    }
  }, [approvedRequestList]);
  return (
    <MainBody>
      <div className="centre-box">
        <div className="box-heading">APPROVED REQUEST</div>
        <div className="request-list">
          {approvedRequestList
            ? approvedRequestList.map((request, key) => {
                return (
                  <RequestView
                    viewModel={REQUEST_PENDING}
                    request={request}
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

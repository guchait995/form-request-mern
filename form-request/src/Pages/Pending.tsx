import React, { useEffect, useState } from "react";
import MainBody from "../Components/MainBody";

import Request from "../Models/Request";
import RequestView from "../Components/RequestView";
import { REQUEST_PENDING } from "../AppConstants";
import { socket } from "../Dao/MongoDao";
import SmallLoading from "../Components/SmallLoading";
export default function Pending() {
  const [pendingRequestList, setPendingRequestList] = useState<Request[]>([]);

  var isMounted = false;
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
      socket.emit("get_latest_request_list");
      socket.on("latest_request_list", data => {
        setPendingRequestList(data);
      });
    }
  }, []);
  var Mounted = false;
  useEffect(() => {
    if (pendingRequestList.length > 0 && !Mounted) {
      Mounted = true;
      socket.on("new_request", data => {
        var tempList = pendingRequestList.slice(0);
        tempList.push(data.request);
        setPendingRequestList(tempList);
      });
    }
  }, [pendingRequestList]);
  return (
    <MainBody>
      <div className="centre-box">
        <div className="box-heading">PENDING REQUEST</div>
        <div className="request-list">
          {pendingRequestList
            ? pendingRequestList.map((request, key) => {
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

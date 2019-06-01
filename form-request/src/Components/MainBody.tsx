import React from "react";
import Header from "./Header";

export default function MainBody(props) {
  return (
    <React.Fragment>
      <Header />
      <div className="main-body">{props.children}</div>
    </React.Fragment>
  );
}

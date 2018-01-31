// use to build a header
import React from "react";
import "./index.scss";

const Console = props => {
  return (
    props.id && <div className="console">
      <span>id: {props.id}</span>
      <span>width: {props.width}</span>
      <span>height: {props.height}</span>
      <span>left: {props.left}</span>
      <span>top: {props.top}</span>
    </div>
  );
};

export default Console;

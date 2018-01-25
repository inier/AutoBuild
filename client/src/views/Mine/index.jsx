// use to build a header
import React from "react";
import "./index.scss";

const Mine = props => {
  return (
    <div className="mine">      
      {props.children}
    </div>
  );
};

export default Mine;

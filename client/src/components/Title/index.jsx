// use to build a header
import React from "react";
import { Icon } from "antd";
import "./index.scss";

const Title = props => {
  return (
    <span style={{ fontSize: 16 }}>
      <Icon type={props.iconType} style={{ marginRight: "3px" }} />
      {props.content}
      <Icon type="edit" style={{ marginLeft: "10px", fontSize: 13, color: '#08c' }} />
    </span>
  );
};

export default Title;

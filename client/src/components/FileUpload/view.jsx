// use to build a header
import React from "react";
import "./index.scss";
import { Icon } from "antd";
const FileUploadIcon = props => {
  this.handleChange = e => {
    props.onChange(e);
  };
  return (
    <div className="iconUpload" title="点击上传图片">
      <div className="content">
        <Icon type="plus" style={{ fontSize: 36 }} />
        {/* <div>{props.content}</div> */}
      </div>
      <input
        type="file"
        // multiple="multiple"
        className="input"
        onChange={this.handleChange}
        accept=""
      />
    </div>
  );
};

export default FileUploadIcon;

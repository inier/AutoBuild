// use to build a header
import React from "react";
import "./index.scss";
import { Icon } from 'antd';
const FileUploadIcon = props => {
    this.handleChange = (e) => {
        props.onChange(e);
    };
    return (
        <div className="uploadIcon">
            <div className="content">
            <Icon type="plus" style={{fontSize:32, color: "#999"}} />
            <div>{props.content}</div>
            </div>
            <input type="file" className="input" onChange={this.handleChange} accept="" />
        </div>
    );
};

export default FileUploadIcon;
// use to build a header
import React from "react";
import "./index.scss";
import { Divider } from 'antd';

const Mine = (props) => {
  return (
    <div className="mine">      
      
      <div className="content">
      <h2>帮助中心</h2>
      <Divider />
        <ul>
          <li></li>
          <li></li>
        </ul>
        <Divider />
      <h3>欢迎使用该工具，有任何使用上的疑问或发现bug等，直接反馈给电商前端团队！</h3>
      </div>      
    </div>
  );
};

export default Mine;

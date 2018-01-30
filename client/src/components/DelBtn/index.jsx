// src/components/delBtn/delBtn.jsx
// 此组件的 目的在于 给 定位到父组件 右上角，点击，执行回调
// 父组件 要有 有定位 信息
//  父组件 要传递 点击回调过来
// 父组件 需要的数据 通过属性绑定过来，在通过 回调函数 传过去
// 父组建  通过数据，设置，本组建 的 位置 left，top ，right，bottom
import React, { Component } from "react";
import { Icon } from "antd";
import "./index.scss";

class DelBtn extends Component {
  constructor(props) {
    super(props);
  }
  handleClick = e => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();    
    typeof this.props.clickCb === "function" && this.props.clickCb(this.props.id);
  };
  render() {
    return (
      <span className="right-up-btn">
      <Icon type="close" onClick={this.handleClick} />      
      </span>
      // <i
      //   className="right-up-btn"
      //   style={this.props.styleObj}
      //   onClick={this.handleClick}
      // />
    );
  }
}

export default DelBtn;

import React, { Component } from "react";
import { inject } from "mobx-react";
import { Icon, Button } from "antd";
import "./index.scss";

@inject("UIStore")
class AddDrag extends Component {
  constructor(props) {
    super(props);
  }

  handleClickAdd = e => {
    console.log("add");
    // 得到选中中的 id this.state.floorOnId, 找到这数据中额id 向这里对象中添加 数据
    // 设置添加对象=============
    this.props.UIStore.setDragData({
      left: "",
      top: "",
      width: 50,
      height: 50,
      id: new Date().getTime() + ""
    });
  };

  render() {
    return (
      <Button
        className={this.props.isActive ? "func show" : "func"}
        key={this.props.key}
        data-type={this.props.type}
        onClick={this.handleClickAdd}
      >
        {this.props.val}
      </Button>
    );
  }
}
export default AddDrag;

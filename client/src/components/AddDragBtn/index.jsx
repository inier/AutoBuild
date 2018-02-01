import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Icon, Button } from "antd";
import "./index.scss";

@inject("UIStore")
@observer
class AddDrag extends Component {
  constructor(props) {
    super(props);
  }
  handleClickAdd = e => {
    console.log("add");
    // 得到选中中的 id this.state.floorOnId, 找到这数据中额id 向这里对象中添加 数据
    // 设置添加对象=============   
    var obj = {
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      id: new Date().getTime() + ""
    };
    var tFloorOnId = this.props.UIStore.floorOnId;
    this.props.UIStore.floorActive("");
    this.props.UIStore.floorActive(tFloorOnId);
    this.props.UIStore.addDragData(obj);
  };

  render() {
    return (
      <Button
        className={this.props.isActive ? "func show" : "func"}
        data-type={this.props.type}
        onClick={this.handleClickAdd}
      >
        {this.props.val}
      </Button>
    );
  }
}
export default AddDrag;

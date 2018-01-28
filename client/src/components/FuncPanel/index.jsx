import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Icon, Button } from "antd";
import "./index.scss";

import AddDragBtn from "../AddDragBtn";

const funcHandleList = [
  {
    val: "添加点击区",
    type: "addBox"
  }
];

@inject("UIStore")
@observer
class FuncPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const funcs = funcHandleList.map((elm, idx) => (
      <AddDragBtn
        key={idx}
        isActive={!!this.props.UIStore.floorOnId}
        {...elm}
      />
    ));
    return <div className="func-panel">{funcs}</div>;
  }
}
export default FuncPanel;

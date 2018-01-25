import React, { Component } from "react";
import { inject } from 'mobx-react';
import { Icon, Button } from "antd";
import "./index.scss";

const leftNavList = [
  {
    val: "添加点击框",
    type: "addBox"
  }
];

@inject("UIStore")
class FuncPanel extends Component {
  constructor(props) {
    super(props);
    this.store = props.UIStore;
  }

  handleClickAdd = () => { 
    console.log("add");
    // 得到选中中的 id this.state.choosedId, 找到这数据中额id 向这里对象中添加 数据
    var imgArr = this.store.imgSrc;
    var choosedId = this.store.choosedId;
    imgArr.map((elm, idx) => {
      if (elm.id == choosedId) {
        if (!elm.clkArr) {
          // 如果 没有这个属性，就设置，有了就直接push
          elm.clkArr = [];
        }
        var obj = {
          // 设置添加对象=============
          left: "",
          top: "",
          width: 50,
          height: 50,
          id: new Date().getTime()
        };
        elm.clkArr.push(obj);
      }
    });
    // 刷新数据====================
    this.props.UIStore.setChoosedImg({
        imgSrc: imgArr 
      }); 
  }

  render(props) {
    return (
      <div className="func-panel">
        {leftNavList.map((elm, idx) => (
          <Button key={idx} data-type={elm.type} onClick={this.handleClickAdd}>
            {elm.val}
          </Button>
        ))}
      </div>
    );
  }
}
export default FuncPanel;

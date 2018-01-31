import React, { Component } from "react";

import "./index.scss";
import { inject, observer } from "mobx-react";
import Dragger from "react-dragger-r";

// 引入 右上角 删除 按钮 组件
import DelBtn from "../DelBtn";
// 设置初始化 最小 w，h
const renderWidth = 100;
const renderHeight = 100;
// 设置 resize 最小，w，h
const minWidth = 30;
const minHeight = 30;
const doc = document;
@inject("UIStore")
class Drag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: renderWidth,
      height:renderHeight,
      left: 0,
      top: 0,
      oringX: 0,
      oringY: 0,
      lastW: renderWidth,
      lastH: renderHeight,
      id: this.props.id,
      attrList: [
        {
          title: "data-title",
          type: "dataTitle",
          value: "",
          id: 1
        },
        {
          title: "data-type",
          type: "dataType",
          value: "",
          id: 2
        },
        {
          title: "链接",
          type: "url",
          value: "",
          id: 3
        }
      ]
    };
  }

  handleClick = e => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
    this.props.handleClick(e.currentTarget.id, e.currentTarget.getAttribute('data-parentid'));
  };

  handleMouseOut = e => {
    e.stopPropagation();
    console.log("out");
    doc.removeEventListener("mousemove", this.move, false);
    doc.addEventListener("mouseup", this.resizeEnd);
  };
  handleMouseUp = e => {
    e.stopPropagation();
    const obj = {
      width: this.state.width,
      height: this.state.height,
      id: this.props.id,
      parentId: this.props.parentId
    };

    this.props.handleMouseUp(obj);
  };
  dragEnd = (e,x,y) => {
    console.log('drag move'+x,y);
    //目标对象
    const tgt = e.currentTarget;
    //的都left ，top
    const tranfrom = tgt && tgt.style && tgt.style.transform || '';
    if(!tranfrom) return;
    const leftTopVal = tranfrom && tranfrom.split('(')[1].split(')')[0].split(',');
    const left = leftTopVal[0].replace('px','');
    const top = leftTopVal[1].replace('px','');
    const obj = {
      left: Number(left),
      top:Number(top),
      id: this.props.id,
      parentId: this.props.parentId
    };
    //const target = e.target.parentElement.parentElement.parentElement;
    const pId = this.props.parentId;
    const cId = this.props.id;
    this.props.UIStore.setDragData(obj, cId, pId);
  }
  dragMove = (e, x, y) => {
    console.log(x + ":" + y);
    console.log(e);
    // x,y , 获取 拖拽的   x,y
    // this.setState({
    //   left: x,
    //   top: y
    // });

    // const obj = {
    //   left: x,
    //   top: y,
    //   id: this.props.id,
    //   parentId: this.props.parentId
    // };

    // this.props.dragMove(obj);
  };
  move = e => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    //console.log(startX,startY);
    //console.log(this.state);
    var width = this.state.lastW;
    var height = this.state.lastH;

    const difWidth = startX - this.state.oringX + width;
    const difHeight = startY - this.state.oringY + height;
    console.log(difWidth,difHeight);
    this.setState({
      width: difWidth < minWidth && minWidth || difWidth,
      height: difHeight < minHeight && minHeight || difHeight
    });
    // const data = {
    //   left:difWidth,
    //   top:difHeight
    // };
    // const target = e.target.parentElement.parentElement.parentElement;
    // const pId = target.getAttribute("data-parentid");
    // const cId = target.id;
    // this.props.UIStore.setDragData(data, cId, pId);
  };
  resizeStart = e => {
    e.stopPropagation();
    doc.body.style.userSelect = "none";
    const startX = e.clientX;
    const startY = e.clientY;
    // console.log(startX,startY);
    this.setState({
      oringX: startX,
      oringY: startY
    });
    doc.addEventListener("mousemove", this.move);
    doc.addEventListener("mouseup", this.resizeEnd);

    //doc.addEventListener('mouseout', this.handleMouseOut.bind(this))
  };
  resizeEnd = e => {
    e.stopPropagation();
    doc.body.style.userSelect = "";

    const lastW = this.state.width;
    const lastH = this.state.height;

    console.log("up");
    doc.onmousemove = null;
    doc.removeEventListener("mousemove", this.move);

    doc.removeEventListener("mouseup", this.resizeEnd);
    this.setState({
      lastW,
      lastH
    });
    const data = {
      width: lastW,
      height: lastH
    };
    const target = e.target.parentElement.parentElement.parentElement;
    const pId = target.getAttribute("data-parentid");
    const cId = target.id;
    this.props.UIStore.setDragData(data, cId, pId);
  };
  // 那个插件 传过来 的数据 ，这这里修改
  changeValue = data => {
    const arr = this.state.attrList;
    // 改变 input 框的 对应 数组的id
    const id = data.id;
    // input   改变值
    const value = data.value;
    // input 框的 类型  dataTile ，？ dataType ? url 三 in 一
    const type = data.type;

    arr.map((elm, idx) => {
      if (elm.id == id) {
        elm.value = value;
      }
    });
    this.setState({
      attrList: arr
    });
    console.log(arr);
    // 组装数据 传到 父组件
    const sendToParentObj = {
      id: this.props.id,
      parentId: this.props.parentId,
      // keyVal 是为了 父组件 读取 子组件 传过去的 识别 添加 什么key
      key: type,
      // value  对应那面的 value  父组件表现形式 key:value
      value: value
    };
    console.log(sendToParentObj);
    // 因为 type 为变量，所以给 对象赋值的时候，不能使用上面的 字面量方法
    //sendToParentObj[type] = value;
    // 这里吧参数，传入到 addImg 组建中，给 点击区域的 数据 总揽添加 list 属性
    this.props.changeAttrList(sendToParentObj);
  };
  // 清空 input 框 value 值
  clearInputVal = data => {
    console.log("dragger" + data);
    const id = data;
    const temArr = this.state.attrList;
    temArr.map((elm, idx) => {
      if (id == elm.id) {
        elm.value = "";
      }
    });
    this.setState({
      attrList: temArr
    });
  };

  // 删除 组建 点击删除
  // 向父组件 同行，利用this.props
  doDelete = (e) => {
    console.log("删除拖拽框");
    const delData = {
      id: this.props.id,
      parentId: this.props.parentId
    };
    this.props.delDragArea(delData);

    // 阻止 事件冒泡==============
  };

  componentWillUnmount() {
    console.log("removed a dragger");
  }
  render() {
    const styleObj = {
      left: `${this.state.left}px`,
      top: `${this.state.top}px`,
      width: `${this.state.width}px`,
      height: `${this.state.height}px`
    };
    console.log("render-----Dragger.");

    return (
      <div onClick={this.handleClick} id={this.props.id} data-parentid={this.props.parentId}>
        <Dragger
          className="clkArea"
          style={styleObj}
          bounds="parent"
          onMove={this.dragMove}
          onDragEnd={this.dragEnd}
        >
          <div className={this.props.isActive ? "content ac" : "content"}>           
            {/* 点击删除 */}
            <DelBtn clickCb={this.doDelete} />
            {/* 拖住啊，改变w，h */}
            <i
              className="dragable"
              onMouseDown={this.resizeStart}
              onMouseUp={this.handleMouseUp}
            //onMouseOut={this.handleMouseOut.bind(this)}
            />
          </div>
        </Dragger>
      </div>
    );
  }
}

export default Drag;

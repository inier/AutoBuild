// 添加，删除，图片
import React, { Component } from "react";
import { observer, inject } from "mobx-react";

import "./index.scss";

// 引入 右上角 删除 按钮 组件
import DelBtn from "../DelBtn";

// 引入 添加 拖拽块 jsx
import Drag from "../Dragger";

@inject("UIStore")
//@observer
class FloorPanel extends Component {
  handleClick = e => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
    this.props.handleClick(e.target.id, this.props.index);
  };

  dragHandleClick = (id, parentId) => {
    console.log("dragHandleClick");
    this.props.UIStore.dragActive(id, parentId);
  };
  // 图片onload 事件
  imgOnload = e => {
    console.log(e.target.offsetWidth, e.target.offsetHeight);
    const trgt = e.target;
    const id = trgt.id;
    const width = trgt.offsetWidth;
    const height = trgt.offsetHeight;

    //  如果这个对象没有 widht ,height 则设置，
    const tplArr = this.props.UIStore.imgSrc;
    tplArr.map((elm, idx) => {
      if (elm.id == id && !(elm.width || elm.height)) {
        //  如果这个对象没有 widht ,height 则设置，
        this.props.UIStore.setFloorData({
          width,
          height
        }, id);
      }
    });
  };

  // 根据 点击区域的 来设置 imgSrc 下面的clkArr
  acordIdChangeData = (changeData) => {

    //var tt = this.props.UIStore.imgSrc;
    const parentdId = (changeData && changeData.parentId) || "";
    const childId = (changeData && changeData.id) || "";
    // 两次轮询
    // sourceData &&
    //   sourceData.map((elm, idx) => {
    //     if (elm.id == parentdId) {
    //       elm.clkArr &&
    //         elm.clkArr.map((elmt, indx) => {
    //           if (elmt.id == childId) {
    //             this.props.UIStore.setDragData({
    //               width: changeData.width ? changeData.width : elmt.width,
    //               height: changeData.height ? changeData.height : elmt.height,
    //               left: changeData.left ? changeData.left : elmt.left,
    //               top: changeData.top ? changeData.top : elmt.top
    //             });
    //             // 这里对每个 点击区域 的 dataTitle dataType url value
    //             // if (changeData.key) {
    //             //   this.props.UIStore.setDragData({
    //             //     [elmt[changeData.key]]: changeData.value || ""
    //             //   });
    //             // }
    //           }
    //         });
    //     }
    //   });
    // return sourceData;    
    this.props.UIStore.setDragData({
      width: changeData.width,
      height: changeData.height,
      left: changeData.left,
      top: changeData.top
    }, childId, parentdId);
  };

  handleMouseUp = val => {
    // 改变 拖拽 组建 w ，h 的回调 val obj
    // 得到 parentId，和id
    //{
    //width:this.state.width,
    // height:this.state.height,
    // id:this.props.id,
    // parentId:this.props.parentId
    //}
    const valObj = val || "";
    //  根据id 查询要改变的 数据
    const changeData = this.acordIdChangeData(valObj);
  };

  dragMove = val => {
    //  改变 拖拽 组件 positon x,y 回调

    const valObj = val || "";
    //  根据id 查询要改变的 数据
    console.log("拖拽时坐标：");
    console.log(valObj);
    const changeData = this.acordIdChangeData(valObj);
  };

  // 需要对 this.state.imgSrc 数组，进行 改变 left，top，width，height
  // 删除 点击区域
  delDragArea = data => {
    // 改变数据
    this.props.UIStore.delActiveDragBox(data.id, data.parentId);
    //判断是不是 删除 当前 选中 dragID 
    //const tDragId = this.props.UIStore.dragOnId;
    //data.id == this.props.UIStore.dragOnId &&  



  };

  // 删除图片=====================================
  delImg = id => {
    this.props.UIStore.delFloorItem(id);
  };

  // 点击 保存 当前 页面 配置数据==========
  storageData() {
    var storageData = JSON.stringify(this.state);
    localStorage.setItem("themePageStorage", storageData);
  }
  // 拖拽 元素===============
  render() {
    console.log("render-----OptPanel.");

    return (
      <div className="img_wrap">
        <div
          className={
            this.props.isActive ? "img_box bounds ac" : "img_box bounds"
          }
          id={this.props.id}
          onClick={this.handleClick}
        >
          <img
            src={this.props.src}
            alt=""
            id={this.props.id}
            onLoad={this.imgOnload}
            draggable="false"
          />
          {/* 删除图片 ===按钮 */}
          <DelBtn id={this.props.id} clickCb={this.delImg} />
          {this.props.clkArr &&
            this.props.clkArr.map((elm, index) => {
              var styleObj = {
                width: elm.width,
                height: elm.height,
                left: elm.left || 0,
                top: elm.top || 0
              };
              return (
                <Drag
                  key={elm.id}
                  id={elm.id}
                  parentId={this.props.id}
                  styleObj={styleObj}
                  isActive={!!(this.props.dragOnId === elm.id)}
                  handleClick={this.dragHandleClick}
                  dragMove={this.dragMove}
                  handleMouseUp={this.handleMouseUp}
                  delDragArea={this.delDragArea}
                />
              );
            })}
        </div>
      </div>
    );
  }
}

export default FloorPanel;

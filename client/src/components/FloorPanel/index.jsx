// 添加，删除，图片
import React, { Component } from "react";
import { observer, inject } from 'mobx-react';

import "./index.scss";

import emitter from "../EventEmitter";
// 引入 右上角 删除 按钮 组件
import DelBtn from "../DelBtn";

// 引入 添加 拖拽块 jsx
import Drag from "../Dragger";

@inject("UIStore")
@observer
class FloorPanel extends Component {
  constructor(props) {
    super(props);
    this.store = props.UIStore;
    this.state = {
      ...this.props
    };
    console.log(props);
  }

  dragHandleClick = (e) => {
    this.store.dragActive(e.target.id);
  }

  handleClick = (e) => {
    this.props.handleClick(e, this.props.index);
  }

  // 图片onload 事件
  imgOnload = (e) => {
    console.log(e.target.offsetWidth, e.target.offsetHeight);
    const trgt = e.target;
    const id = trgt.id;
    const width = trgt.offsetWidth;
    const height = trgt.offsetHeight;

    //  如果这个对象没有 widht ,height 则设置，
    this.store.updateDragCfg({
      width,
      height
    });
  }

  // 根据 点击区域的 来设置 imgSrc 下面的clkArr
  acordIdChangeData(changeData, sourceData) {
    const parentdId = (changeData && changeData.parentId) || "";
    const childId = (changeData && changeData.id) || "";
    // 两次轮询
    sourceData &&
      sourceData.map((elm, idx) => {
        if (elm.id == parentdId) {
          elm.clkArr &&
            elm.clkArr.map((elmt, indx) => {
              if (elmt.id == childId) {
                this.store.updateDragCfg({
                  width: changeData.width ? changeData.width : elmt.width,
                  height: changeData.height ? changeData.height : elmt.height,
                  left: changeData.left ? changeData.left : elmt.left,
                  top: changeData.top ? changeData.top : elmt.top,
                });
                // 这里对每个 点击区域 的 dataTitle dataType url value
                if (changeData.key) {
                  this.store.updateDragCfg({
                    [elmt[changeData.key]]: changeData.value || ""
                  });
                }
              }
            });
        }
      });
    return sourceData;
  }

  handleMouseUp = (val) => {
    // 改变 拖拽 组建 w ，h 的回调 val obj
    // 得到 parentId，和id
    //{
    //width:this.state.width,
    // height:this.state.height,
    // id:this.props.id,
    // parentId:this.props.parentId
    //}
    const valObj = val || "";
    //
    // 数据源
    const imgArr = this.store.imgSrc;
    //  根据id 查询要改变的 数据
    const changeData = this.acordIdChangeDate(valObj, imgArr);
  }

  dragMove = (val) => {
    //  改变 拖拽 组件 positon x,y 回调
    const valObj = val || "";
    //
    // 数据源
    const imgArr = this.store.imgSrc;
    //  根据id 查询要改变的 数据
    const changeData = this.acordIdChangeDate(valObj, imgArr);
  }

  // 这里是，那面 拖住啊 组建的 属性值的 ，函数回调
  changeAttrList = (data) => {
    // 这里添加属性
    console.log(data);
    const changeData = data;
    const sourceData = this.store.imgSrc;
    // 数据
    var changedData = this.acordIdChangeDate(changeData, sourceData);
  }

  // 需要对 this.state.imgSrc 数组，进行 改变 left，top，width，height
  // 删除 点击区域
  delDragArea = (data) => {
    // 改变数据
    this.store.delActiveDragBox();
  }
  // 删除图片=====================================
  delImg = (data) => {
    const id = data;
    const temArr = [...this.store.imgSrc];
    temArr.map((elm, idx) => {
      if (elm.id == id) {
        temArr.splice(idx, 1);
      }
    });
    this.store.setChoosedImg({
      imgSrc: [...temArr]
    });
  }
  // 点击 保存 当前 页面 配置数据==========
  storageData() {
    var storageData = JSON.stringify(this.state);
    localStorage.setItem("themePageStorage", storageData);
  }
  // 拖拽 元素===============
  render() {
    console.log("start render after componentWillMount");

    console.log("------------------------------------------");

    return (
      <div className="img_wrap" key={this.props.index}>
        <div
          className={
            this.state.isActive ? "img_box bounds ac" : "img_box bounds"
          }
          id={this.state.id}
          onClick={this.props.handleClick}
        >
          {/* 删除图片 ===按钮 */}
          {/* <i className="remove-img"></i> */}
          <DelBtn needData={this.state.id} clickCb={this.delImg} />
          <img src={this.state.src} alt="" id={this.state.id} onLoad={this.imgOnload} />
          {this.state.clkArr &&
            this.state.clkArr.map((elm, index) => {
              return (
                <Drag
                  key={index}
                  id={elm.id}
                  parentId={this.state.id}
                  onClick={this.dragHandleClick}
                  dragMove={this.dragMove}
                  handleMouseUp={this.handleMouseUp}
                  changeAttrList={this.changeAttrList}
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

// 添加，删除，图片
import React, { Component } from "react";
import { inject } from 'mobx-react';

import "./index.scss";

import emitter from "../EventEmitter";
// 引入 右上角 删除 按钮 组件
import DelBtn from "../DelBtn";

// 引入 添加 拖拽块 jsx
import Drag from "../Dragger";

@inject("UIStore")
class OptPanel extends Component {
  constructor(props) {
    super(props);

    this.store = props.UIStore;

    this.choosedImg = this.choosedImg.bind(this);
    this.imgOnload = this.imgOnload.bind(this);
    this.delImg = this.delImg.bind(this);
    this.delDragArea = this.delDragArea.bind(this);
    this.dragMove = this.dragMove.bind(this);
    this.changeAttrList = this.changeAttrList.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  choosedImg(e) {
    e.stopPropagation();
    var id = e.target.id;
    var imgArr = this.store.imgSrc;
    imgArr.map((elm, idx) => {
      // 设置对应的 key 的值
      elm.isActive = elm.id == id ? true : false;
    });
    this.store.setChoosedImg({
      imgSrc: imgArr,
      floorOnId: id
    });    
  }

  handleClick = (e) =>{
    this.store.setDragid(e.target.id);    
  }

  // 图片onload 事件
  imgOnload(e) {
    console.log(e.target.offsetWidth, e.target.offsetHeight);
    const trgt = e.target;
    const id = trgt.id;
    const width = trgt.offsetWidth;
    const height = trgt.offsetHeight;
    const tplArr = this.state.imgSrc;
    tplArr.map((elm, idx) => {
      if (elm.id == id) {
        //  如果这个对象没有 widht ,height 则设置，
        elm.width = !elm.width && width;
        elm.height = !elm.height && height;
      }
    });
    this.setState({
      imgSrc: tplArr
    });

    // e.target.width, e.target.heigt ,获取 图片的高度，宽度
  }

  componentDidMount() {
    // var dom = this.getDOMNode()

    //console.log(this.getDOMNode());

    console.log("start componentDidMount after render");
    /// 声明自定义事件
    
    // 在这里在 使用 emitter ，注册一个事件，有drag.jsx来触发
    this.drager = emitter.addListener("dragBox", obj => {
      console.log(obj);
      const changeId = (obj && obj.id) || "";
      // 标志位，是否有改变 isChanged
      const isChanged = false;
      // 得到 那面返回来的数据，使用setState
      var tplArr = this.store.imgSrc;
      tplArr.map((elm, idx) => {
        elm.clkArr.map((clkElm, index) => {
          if (changeId == clkElm.id) {
            //isChanged = true;
            clkElm.left = obj.left;
            clkElm.top = obj.top;
          }
        });
      });
      this.store.setChoosedImg({
        imgSrc: tplArr 
       });
    });
  }

  // 组件销毁前移除事件监听
  componentWillUnmount() {
    emitter.removeListener(this.eventEmitter);
    emitter.removeListener(this.drager);
  }
  handleMouseUp(val) {
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
    const imgArr =  this.store.imgSrc;
    //  根据id 查询要改变的 数据
    const changeData = this.acordIdChangeDate(valObj, imgArr);
    this.store.setChoosedImg({
      imgSrc: changeData
     }); 
  }
  dragMove(val) {
    //  改变 拖拽 组件 positon x,y 回调
    const valObj = val || "";
    //
    // 数据源
    const imgArr =  this.store.imgSrc;
    //  根据id 查询要改变的 数据
    const changeData = this.acordIdChangeDate(valObj, imgArr);
    this.store.setChoosedImg({
      imgSrc: changeData
     });    
  }
  // 根据 点击区域的 来设置 imgSrc 下面的clkArr
  acordIdChangeDate(changeData, sourceData) {
    const parentdId = (changeData && changeData.parentId) || "";
    const childId = (changeData && changeData.id) || "";
    //  两次轮询
    sourceData &&
      sourceData.map((elm, idx) => {
        if (elm.id == parentdId) {
          elm.clkArr &&
            elm.clkArr.map((elmt, indx) => {
              if (elmt.id == childId) {
                elmt.width = changeData.width ? changeData.width : elmt.width;
                elmt.height = changeData.height
                  ? changeData.height
                  : elmt.height;
                elmt.left = changeData.left ? changeData.left : elmt.left;
                elmt.top = changeData.top ? changeData.top : elmt.top;
                // 这里对每个 点击区域 的 dataTitle dataType url value
                if (changeData.key) {
                  elmt[changeData.key] = changeData.value || "";
                }
              }
            });
        }
      });
    return sourceData;
  }

  // 这里是，那面 拖住啊 组建的 属性值的 ，函数回调
  changeAttrList(data) {
    // 这里添加属性
    console.log(data);
    const changeData = data;
    const sourceData =  this.store.imgSrc;
    // 数据
    var changedData = this.acordIdChangeDate(changeData, sourceData);
    
    this.store.setChoosedImg({
      imgSrc: changedData
     }); 
  }

  // 需要对 this.state.imgSrc 数组，进行 改变 left，top，width，height
  // 删除 点击区域
  delDragArea(data) {
    // 解构 == 》赋值 es6
    const { parentId, id } = data;
    // 改变数据 源
    var temArr =  this.store.imgSrc;
    temArr.map((elm, idx) => {
      if (elm.id == parentId) {
        var delTarget = elm.clkArr;
        delTarget.map((elm, idx) => {
          if (elm.id == id) {
            delTarget.splice(idx, 1);
            return;
          }
        });
      }
    });

    this.store.setChoosedImg({
      imgSrc: temArr
     });    
  }
  // 删除图片=====================================
  delImg(data) {
    const id = data;
    const temArr =  this.store.imgSrc;
    temArr.map((elm, idx) => {
      if (elm.id == id) {
        temArr.splice(idx, 1);
      }
    });
    this.store.setChoosedImg({
      imgSrc: temArr
     }); 
  }
  // 点击 保存 当前 页面 配置数据==========
  storageData() {
    var storageData = JSON.stringify(this.state);
    localStorage.setItem("themePageStorage", storageData);
  }
  // 拖拽 元素===============
  render(props) {
    console.log("start render after componentWillMount");

    console.log("------------------------------------------");
    return (
      <div className="img_coporation">

        {this.store.imgSrc.map((elm, idx) => {
          var indexTag = elm.id;
          return (
            <div className="img_wrap" key={idx}>
              <div
                className={
                  elm.isActive ? "img_box bounds ac" : "img_box bounds"
                }
                id={elm.id}
                onClick={this.choosedImg}
              >
                {/* 删除图片 ===按钮 */}
                {/* <i className="remove-img"></i> */}
                <DelBtn needData={elm.id} clickCb={this.delImg} />
                <img src={elm.src} alt="" id={elm.id} onLoad={this.imgOnload} />
                {elm.clkArr &&
                  elm.clkArr.map((elm, index) => {
                    return (
                      <Drag
                        key={index}
                        id={elm.id}
                        onClick={this.handleClick}
                        delDragArea={this.delDragArea}
                        parentId={indexTag}
                        dragMove={this.dragMove}
                        changeAttrList={this.changeAttrList}
                        handleMouseUp={this.handleMouseUp}
                      />
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default OptPanel;

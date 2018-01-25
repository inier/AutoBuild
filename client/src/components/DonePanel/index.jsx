import React, { Component } from "react";
import "./index.scss";
import { Icon,Button } from "antd";
import { inject } from 'mobx-react';

@inject("UIStore")
class DonePanel extends Component {
  constructor(props) {
    super(props);
    this.store = props.UIStore;
    this.getLayData = this.getLayData.bind(this);    
  }
 
  // 得到布局 数据函数==============向后台发起  ajax 通信，数据，
  getLayData() {
    const data = this.store.imgSrc;
    // 根据 imgSrc 数据算取，点击区域的 left ,top,width,height,css 样式

    const totalArr = [];
    data.map((elm, idx) => {
      const parentWidth = elm.width || "";
      const parentHeight = elm.height || "";
      const index_idx = idx;
      const arr = [];
      // 轮询 点击区域
      elm.clkArr &&
        elm.clkArr.map((elmt, index) => {
          const width = `${(elmt.width / parentWidth * 100).toFixed(2)}%`;
          const height = `${(elmt.height / parentHeight * 100).toFixed(2)}%`;
          const left = `${(elmt.left / parentWidth * 100).toFixed(2)}%`;
          const top = `${(elmt.top / parentHeight * 100).toFixed(2)}%`;
          const url = `${elmt.url || ""}`;
          const dataTitle = `${elmt.dataTitle || ""}`;
          const dataType = `${elmt.dataType || ""}`;
          const obj = {
            width,
            height,
            left,
            top,
            dataTitle,
            dataType,
            url
          };
          arr.push(obj);
        });
      totalArr.push({
        // 图片索引，第几章图片
        index: index_idx + 1,
        // 没张图片的 点击区域 的样式 百分比 eg{left：'',top:'',width:'',height:''}
        data: (arr.length && arr) || "",
        // 图片的 base64编码
        base64Src: elm.src
      });
    });
    console.log(totalArr);
    // 发起ajax 请求，server。js来获取并相应
    const sendData = JSON.stringify(totalArr);

    // 得到 生成 网页 的 类型 pc app

    const isPc =
      (this.store.pageType == "pc" && 1) ||
      (this.store.pageType == "app" && 2) ||
      "";  

    // 发起请求 前验证数据 的有效性==============
    // 发起ajax 请求，server.js来获取并相应
    if (totalArr.length) {
      this.props.userStore.DoneIt({
        data: sendData,
        isPc: isPc, // 是1--> pc 还是 2--->app
        title: this.store.pageTitle,
        keyword: this.store.pageKeyword,
        description: this.store.pageDescription
      });
    } else {
      alert("请先选择图片");
    }
  }

  render() {
    return (
      <span className="done-panel">
        <Button type="primary" onClick={this.getLayData}>构建<Icon type="caret-right" /></Button>
        {
          <a
            href={this.store.previewUrl}
            style={{
              display: this.store.previewUrl ? "inline-block" : "none"
            }}
            className="ml"
            target="_blank"
          >
            预览<Icon type="aliyun" />
          </a>
        }
        {
          <a
            href={this.store.downloadUrl}
            style={{
              display: this.store.downloadUrl ? "inline-block" : "none"
            }}
            className="ml"
            download={this.store.downloadUrl}
          >
            点击下载<Icon type="download" />
          </a>
        }
        {/* <button onClick = {this.storageData.bind(this)}>保存当前配置数据</button> */}
      </span>
    );
  }
}
export default DonePanel;

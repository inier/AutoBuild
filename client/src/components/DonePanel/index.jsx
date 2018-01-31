import React, { Component } from "react";
import "./index.scss";
import { Icon, Button } from "antd";
import { observer, inject } from "mobx-react";
import { Popconfirm, message } from "antd";

@inject("UIStore")
@observer
class DonePanel extends Component {
  constructor(props) {
    super(props);
  }

  // 得到布局 数据函数==============向后台发起  ajax 通信，数据，
  getLayData = () => {
    const data = this.props.UIStore.imgSrc;
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
      (this.props.UIStore.pageType === "pc" && 1) ||
      (this.props.UIStore.pageType === "app" && 2) ||
      "";

    // 发起请求 前验证数据 的有效性==============
    // 发起ajax 请求，server.js来获取并相应
    if (totalArr.length) {
      this.props.UIStore.DoneIt({
        data: sendData,
        isPc: isPc, // 是1--> pc 还是 2--->app
        title: this.props.UIStore.pageTitle,
        keyword: this.props.UIStore.pageKeyword,
        description: this.props.UIStore.pageDescription
      });
    } else {
      message.error("神马都没有，搞个毛线啊!");
    }
  };

  confirm = (e) => {
    message.warning('开始构建，先休息一会儿吧！');
    this.getLayData();
  }

  cancel = (e) => {
    //console.log(e);
    message.info('革命尚未成功，同志仍需努力！');
  }

  render() {
    return (
      <span className="done-panel">
        <Button
          href={this.props.UIStore.previewUrl}
          style={{
            display: this.props.UIStore.previewUrl ? "inline-block" : "none"
          }}
          className="mr preview"
          target="_blank"
        >
          预览<Icon type="aliyun" />
        </Button>
        <Button
          href={this.props.UIStore.downloadUrl}
          style={{
            display: this.props.UIStore.downloadUrl ? "inline-block" : "none"
          }}
          className="mr download"
          download={this.props.UIStore.downloadUrl}
        >
          下载<Icon type="download" />
        </Button>
        {this.props.UIStore.imgSrc.length && <Popconfirm title="各项配置是否已完成?" onConfirm={this.confirm} onCancel={this.cancel} okText="确定" cancelText="稍等">
          <Button type="primary" onClick={this.getLayData}>
            构建<Icon type="caret-right" />
          </Button>
        </Popconfirm>}
        {/* <button onClick = {this.storageData.bind(this)}>保存当前配置数据</button> */}
      </span>
    );
  }
}
export default DonePanel;

// use to build a header
import React, { Component } from "react";
import { observer, inject } from 'mobx-react';
import "./index.scss";
import { Icon, Upload, message } from 'antd';
import FileUploadIcon from "../FileUpload/view.jsx";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 8;
  if (!isLt2M) {
    message.error('Image must smaller than 8MB!');
  }
  return isJPG && isLt2M;
}

@inject("UIStore")
class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.store = props.UIStore;
    this.state = {
      loading: false,
    };
  }

  // 测试===============================================
  choose = (e) => {
    //console.log(e.target.value)
    var fileReader = new FileReader();
    var file = e.target.files[0];
    fileReader.readAsDataURL(file);

    // getBase64(info.file.originFileObj, imageUrl => {
    //   console.log(imageUrl);

    //   var obj = {
    //     id: new Date().getTime(),
    //     src: this.state.imageUrl,
    //     isActive: false
    //   };
    //   // 获取图片的宽和高，w，h 不是真实的，是相对的，要获取百分比
    //   arr.push(obj);
    //   this.store.setChoosedImg({ imgSrc: arr });
    // });

    //console.log(file);
    fileReader.onloadend = onEv => {
      var src = onEv.target.result; //base64

      var img = new Image();
      img.src = src;
      img.onload = () => {
        this.setState({
          loading: false
        });
        //console.log(img.width,img.height);              
      };

      var obj = {
        id: new Date().getTime() + "",
        src: src,
        isActive: false
      };

      this.store.floorDataPush(obj);
    };
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <FileUploadIcon content="点击上传" onChange={this.choose} />
    );
  }
}

export default FileUpload;

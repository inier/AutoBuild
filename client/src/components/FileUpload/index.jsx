// use to build a header
import React, { Component } from "react";
import { inject } from "mobx-react";
import "./index.scss";
import { Icon, message } from "antd";
import FileUploadIcon from "../FileUpload/view.jsx";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === "image/jpeg";
  if (!isJPG) {
    message.error("You can only upload JPG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 8;
  if (!isLt2M) {
    message.error("Image must smaller than 8MB!");
  }
  return isJPG && isLt2M;
}

@inject("UIStore")
class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.store = props.UIStore;
    this.state = {
      loading: false
    };
  }

  // 测试===============================================
  choose = e => {
    if (typeof FileReader === "undefined") {
      alert("抱歉，你的浏览器不支持 FileReader");
      e.target.setAttribute("disabled", "disabled");
    } else {      
      if (!e.target["value"].match(/.jpg|.gif|.png|.bmp/i)) {
        //判断上传文件格式
        alert("上传的图片格式不正确，请重新选择");
        return;
      }
      //e.target.addEventListener("change", readFile, false);
      var fileReader = new FileReader();
      //console.log(file);
      fileReader.readAsDataURL(e.target.files[0]);
      fileReader.onloadend = e => {
        var src = e.target.result; //base64

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

    /* //handler
    function readFile() {
      var fileReader = new FileReader();
      //console.log(file);
      fileReader.readAsDataURL(e.target.files[0]);
      fileReader.onloadend = e => {
        var src = e.target.result; //base64

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

    function readFiles(files) {
      for (var i = 0; i < files.length; i++) {
        readFile(files[i]);
      }
    }

    function readFile2Remote() {
      var fd = new FormData();
      for (var i = 0; i < this.files.length; i++) {
        var reader = new FileReader();
        reader.readAsDataURL(this.files[i]);
        fd.append(i, this.files[i]);
      }
      this.store.upload2Remote(fd);
    } */

    e.target.value = "";
  };

  render() {
    return <FileUploadIcon content="点击上传" onChange={this.choose} />;
  }
}

export default FileUpload;

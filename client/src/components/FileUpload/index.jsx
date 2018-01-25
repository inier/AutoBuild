// use to build a header
import React, { Component } from "react";
import { inject } from 'mobx-react';
import "./index.scss";
import { Upload, Icon, message } from 'antd';

const Dragger = Upload.Dragger;

const props = {
  name: 'file',
  multiple: true,
  action: '//jsonplaceholder.typicode.com/posts/',
  onChange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {      
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};


class FileUpload1 extends Component {
  constructor() {
    super();
    this.choose = this.choose.bind(this);
  }

  // 测试===============================================
  choose(e) {
    //console.log(e.target.value)
    var fileReader = new FileReader();
    var file = e.target.files[0];
    fileReader.readAsDataURL(file);
    var arr = this.state.imgSrc;
    //console.log(file);
    fileReader.onloadend = onEv => {
      var src = onEv.target.result; //base64
      var img = new Image();
      img.src = src;
      img.onload = function () {
        //console.log(img.width,img.height);
      };
      var obj = {
        id: new Date().getTime(),
        src: src,
        isActive: false
      };
      // 获取图片的宽和高，w，h 不是真实的，是相对的，要获取百分比
      arr.push(obj);
      this.setState({ imgSrc: arr });
    };
  }

  render(props) {
    return <input type="file" onChange={this.choose} />;
  }
}

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
class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.UIStore;
    this.state = {
      loading: false,      
    };
  }  
  
  handleChange = (info) => {
    var arr = this.store.imgSrc;

    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        console.log(imageUrl);
        this.setState({
          imageUrl,
          loading: false,
        });
        
        var obj = {
          id: new Date().getTime(),
          src: this.state.imageUrl,
          isActive: false
        };
        // 获取图片的宽和高，w，h 不是真实的，是相对的，要获取百分比
        arr.push(obj);
        this.store.setChoosedImg({ imgSrc: arr });
      });
    }
  }
  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <div>
      <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <Icon type="upload" />
      </p>
      <p className="ant-upload-text">点击上传，或拖拽文件到该区域即可上传</p>
      <p className="ant-upload-hint">支持单个文件或多个文件上传</p>      
    </Dragger>
      </div>
    );
  }
}

export default FileUpload;

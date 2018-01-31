// use to build a header
import React from "react";
import "./index.scss";
import { Divider } from 'antd';

const Mine = (props) => {
  return (
    <div className="about">
      <div className="content">
        <h2>专题可视化构建工具<span className="desc">提供一套可供运营人员操作的专题页构建工具。</span></h2>
        <Divider />
        <div className="cont">
          <div id='write' className='is-node'>

            <h3><a name='header-n5' className='md-header-anchor '></a>功能特性</h3>
            <p>可视化切图（暂不支持）</p>
            <p>可视化编辑</p>
            <p>支持代码自动压缩</p>
            <p>支持图片自动压缩</p>
            <p>支持发布前预览</p>
            <p>支持构建后直接下载专题包</p>
            <p>一键发布（暂不支持）</p>
            <h3><a name='header-n20' className='md-header-anchor '></a>技术特性</h3>
            <p>基于ES6/7标准语法</p>
            <p>基于scss/css modules样式处理</p>
            <p>基于公共主题可配置</p>
            <p>基于antd UI框架</p>
            <p>基于react前端框架</p>
            <p>基于mobx状态管理</p>
            <p>基于Fetch数据请求</p>
            <p>基于koa后端框架（node）</p>
            <p>基于自动化构建（webpack）</p>
            <p>未来将支持服务端渲染。</p>
            <h3><a name='header-n33' className='md-header-anchor '></a>后续计划</h3>
            <div start=''>
              <p>增加本地缓存机制，防止错误操作导致工作白费。</p>
              <p>收集用户反馈信息进一步扩展功能和优化。</p>
              <p>打通后台数据，提供模板支持。</p>
              <p>进一步提供独立可用的工具模块，远程压缩等。</p>
              <p>提供更友好的可视化交互。</p>
            </div>
          </div>
        </div>
        <Divider />
        <h3>欢迎使用该工具，有任何使用上的疑问或发现bug等，直接反馈给电商前端团队！</h3>
      </div>
    </div>
  );
};

export default Mine;

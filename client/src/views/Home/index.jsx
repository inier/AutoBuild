import React, { Component } from "react";
import ReactDom from "react-dom";

import "./index.scss";

import { LocaleProvider, message, Layout, Menu, Collapse, Divider } from "antd";
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from "antd/lib/locale-provider/zh_CN";

import Title from "../../components/Title";
import Head from "../../components/Header";
import Foot from "../../components/Footer";
import MainPanel from "../../components/MainPanel";
import InfoPanel from "../../components/InfoPanel";
import FuncPanel from "../../components/FuncPanel";
import CfgPanel from "../../components/CfgPanel";
import DonePanel from "../../components/DonePanel";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const Panel = Collapse.Panel;

// 全局名称显示头部信息
const UIConfig = {
  header: {
    content: "专题可视化构建工具"
  },
  footer: {
    content: "Design ©2018 Created by xxx"
  }
};

class Home extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <LocaleProvider locale={zhCN}>
        <Layout>
          <Header>
            <Head>{UIConfig.header.content}</Head>
            <DonePanel />
          </Header>
          <Layout>
            <Sider style={{ backgroundColor: "#fff" }}>
              <Collapse bordered={false} defaultActiveKey={['1']}>
                <Panel showArrow={false} header={<Title iconType="profile" content="专题信息" />} key="1">
                  <InfoPanel />
                </Panel>
              </Collapse>              
            </Sider>
            <Content>
              <MainPanel />
            </Content>
            <Sider style={{ backgroundColor: "#fff" }}>
              <Collapse bordered={false} defaultActiveKey={['1']}>
                <Panel showArrow={false} header={<Title iconType="appstore-o" content="模块信息" />} key="1">
                  <CfgPanel />
                </Panel>
              </Collapse>
              <Divider>编辑功能区</Divider>
              <FuncPanel />
            </Sider>
          </Layout>
          <Footer>
            <Foot>{UIConfig.footer.content}</Foot>
          </Footer>
        </Layout>
      </LocaleProvider>
    );
  }
}

export default Home;
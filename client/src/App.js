import React, { Component } from "react";
import Async from "react-code-splitting";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { useStrict } from "mobx";
import { Provider } from "mobx-react";
import rootStore from "./stores/RootStore";

import { LocaleProvider, Layout } from "antd";
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from "antd/lib/locale-provider/zh_CN";

import Head from "./components/Header";
import Foot from "./components/Footer";
import DonePanel from "./components/DonePanel";
import "./App.scss";
useStrict(true);

const { Header, Footer } = Layout;

// 全局名称显示头部信息
const UIConfig = {
  header: {
    content: "专题可视化构建工具"
  },
  footer: {
    content: "Design ©2018 Created by CAEC-FED"
  }
};

class App extends Component {
  render() {
    return (
      <Provider {...rootStore}>
        <Router>
          <LocaleProvider locale={zhCN}>
            <Layout>
              <Header>
                <Head>{UIConfig.header.content}</Head>
                <DonePanel />
              </Header>
              <Route
                path="/"
                exact
                component={() => <Async load={import("./views/Home")} />}
              />
              <Route
                path="/about"
                exact
                component={() => <Async load={import("./views/about")} />}
              />
              {/* <Route
                path="/mine"
                exact
                component={() => <Async load={import("./views/Mine")} />}
              />              
              <Route
                path="/login"
                exact
                component={() => <Async load={import("./views/Login")} />}
              />
              <Route
                path="/es6"
                exact
                component={() => <Async load={import("./App.ES6")} />}
              />
              <Route
                path="/esnext"
                exact
                component={() => <Async load={import("./App.ESNext")} />}
              /> */}

              <Footer>
                <ul className="router">
                  <li>
                    <Link to="/">首页</Link>
                  </li>
                  
                  <li>
                    <Link to="/about">关于</Link>
                  </li>
                  {/* <li>
                    <Link to="/mine">使用须知</Link>
                  </li>
                  <li>
                    <Link to="/login">登录</Link>
                  </li>
                  <li>
                    <Link to="/es6">Mobx ES6</Link>
                  </li>
                  <li>
                    <Link to="/esnext">Mobx ESNext</Link>
                  </li> */}
                </ul>
                <Foot>{UIConfig.footer.content}</Foot>
              </Footer>
            </Layout>
          </LocaleProvider>
        </Router>
      </Provider>
    );
  }
}

export default App;

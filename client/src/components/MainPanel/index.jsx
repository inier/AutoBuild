import React, { Component } from "react";
import FileUpload from "../FileUpload";
import "./index.scss";
import { Layout } from "antd";
import OptPanel from "../OptPanel";

class MainPanel extends Component {
  render() {
    return (
      <Layout>
        <OptPanel />
        <FileUpload />
      </Layout>
    );
  }
}
export default MainPanel;

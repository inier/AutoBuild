import React, { Component } from "react";
import FileUpload from "../FileUpload";
import "./index.scss";
import OptPanel from "../OptPanel";

class MainPanel extends Component {
  constructor() {
    super();
  }

  render(props) {
    return (
      <div>
        <OptPanel />
        <FileUpload />
      </div>
    );
  }
}
export default MainPanel;

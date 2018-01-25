import React, { Component } from "react";
import FloorPanel from "../FloorPanel";
import FileUpload from "../FileUpload";
import "./index.scss";

class MainPanel extends Component {
  constructor() {
    super();
  }

  render(props) {
    return (
      <div>
        <FloorPanel />
        <FileUpload />
      </div>
    );
  }
}
export default MainPanel;

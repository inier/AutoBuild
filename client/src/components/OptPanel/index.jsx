import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Layout } from "antd";
import styles from "./index.scss";

import FloorPanel from "../FloorPanel";

@inject("UIStore")
@observer
class OptPanel extends Component {
  constructor(props) {
    super(props);
  }

  handleClick = (id, index) => {
    console.log("floorHandleClick");    
    this.props.UIStore.floorActive(id, index);
  };

  render() {
    console.log("render-----OptPanel.");
    console.log("------------------------------------------");
    //var tFloorId = this.props.UIStore.floorOnId;
    var floors = this.props.UIStore.imgSrc.map((elm, idx) => {
      var tProps = {
        id: elm.id,
        src: elm.src,
        clkArr: elm.clkArr
      };
      return (
        <FloorPanel
          key={elm.id}
          index={idx}
          dragOnId={this.props.UIStore.dragOnId}
          isActive={!!(this.props.UIStore.floorOnId === elm.id)}
          handleClick={this.handleClick}
          {...tProps}
        />
      );
    });

    return <Layout className={styles.imgCoporation}>{floors}</Layout>;
  }
}
export default OptPanel;

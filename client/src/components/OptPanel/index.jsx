import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Layout } from "antd";
import styles from "./index.scss";

import FloorPanel from "../FloorPanel";
//import Console from "../Console";

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

    // var tt = this.props.UIStore.getDragItem();
    // var logs = {
    //   id: tt.id || "",
    //   left: tt.left || 0,
    //   top: tt.top || 0,
    //   width: tt.width || 0,
    //   height: tt.height || 0
    // };

    return (<Layout className={styles.imgCoporation}>
      {floors}
      {/* {tt && <Console {...logs} />} */}
    </Layout>);
  }
}
export default OptPanel;

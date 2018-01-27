import React, { Component } from "react";
import { observer, inject } from 'mobx-react';
import { Layout } from "antd";
import styles from "./index.scss";

import FloorPanel from "../FloorPanel";

@inject("UIStore")
@observer
class OptPanel extends Component {
  constructor(props) {
    super(props);
    this.store = props.UIStore;
  }

  handleClick = (e, index) => {
    console.log("handleClick");
    this.store.floorActive(e.target.id, index);
  }

  render() {
    var floors = this.store.imgSrc.map((elm, idx) => {
      var tProps = {
        id: elm.id,
        src: elm.src,
        clkArr: elm.clkArr
      };      
      return (<FloorPanel key={elm.id} index={idx} handleClick={this.handleClick} {...tProps} />);
    });

    return (
      <Layout className={styles.imgCoporation}>
        {floors}
      </Layout>
    );
  }
}
export default OptPanel;

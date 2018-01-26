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
  floorHandleClick = (e) =>{    
    this.store.floorActive(e.target.id);
  }
  render() {
    var floors = this.store.imgSrc.map((elm, idx) => {      
      return (<FloorPanel key={idx} {...elm} onClick={this.floorHandleClick} />);
    });

    return (
      <Layout className={styles.imgCoporation}>
        {floors}
      </Layout>
    );
  }
}
export default OptPanel;

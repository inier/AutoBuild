import React, { Component } from 'react';
import styles from './index.scss';
import { inject } from 'mobx-react';

@inject("userStore")
class Login extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e){
    this.props.userStore.adHook({
      channelId:"mine_car_home"
    });
  }
  render() {
    return (
      <div className={styles.main}>
        <h2>这是登录页</h2>
        <div onClick={this.handleClick}>接口获取</div>
      </div>
    );
  }
}

export default Login;

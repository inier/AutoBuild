import { observer, inject } from 'mobx-react';
import React, { Component } from 'react';
import './App.scss';

// mobx.useStrict(true);

const AppES6 = inject("TestStore")(observer(class App extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.TestStore;
  }
  render() {
    return (
      <div className="App">
        <p className="App-title">Mobx test ES6写法.</p>
        <div>
          <div>username: {this.store.userInfo.nickName}</div>
          <div>mobile: {this.store.userInfo.mobile}</div>
          <p>counter: {this.store.count}</p>
          <p>square: {this.store.square}</p>
          <button onClick={() => this.store.setUserName("modss")}>+</button>
          <button onClick={() => this.store.setMobile("15923145993")}>+</button>
          <button onClick={() => this.store.increment()}>+</button>
          <button onClick={() => this.store.decrement()}>-</button>
        </div>
      </div>
    );
  }
}));

export default AppES6;
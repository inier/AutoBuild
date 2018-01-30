import { observer, inject } from 'mobx-react';
import React, { Component } from 'react';
import './App.scss';
import DevTools from 'mobx-react-devtools';

// mobx.useStrict(true);

@inject("TestStore")
@observer
class AppESNext extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.TestStore;
  }
  render() {
    return (
      <div className="App">
        <DevTools />
        <p className="App-title">Mobx test ES.Next写法.</p>
        <div>
          <p>counter: {this.store.count}</p>
          <p>square: {this.store.square}</p>
          <button onClick={() => this.store.increment()}>+</button>
          <button onClick={() => this.store.decrement()}>-</button>
        </div>
      </div>
    );
  }
}

export default AppESNext;
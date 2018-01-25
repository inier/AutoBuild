import {observer, inject} from 'mobx-react';
import React, { Component } from 'react';
import './App.scss';

// mobx.useStrict(true);

const AppES6 = inject("UIStore")(observer(class App extends Component {
  render() {
    return (
      <div className="App">
        <p className="App-title">Mobx test ES6写法.</p>
        <div>
            <p>counter: {this.props.UIStore.count}</p>
            <p>square: {this.props.UIStore.square}</p>
            <button onClick={() => this.props.UIStore.increment()}>+</button>
            <button onClick={() => this.props.UIStore.decrement()}>-</button>
        </div>
      </div>
    );
  }
}));

export default AppES6;
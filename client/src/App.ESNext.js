import {observer, inject} from 'mobx-react';
import React, { Component } from 'react';
import './App.scss';
import DevTools from 'mobx-react-devtools';

// mobx.useStrict(true);

@inject("UIStore")
@observer
class AppESNext extends Component {  
  render() {
    return (
      <div className="App">
          <DevTools />
        <p className="App-title">Mobx test ES.Next写法.</p>
        <div>
            <p>counter: {this.props.UIStore.count}</p>
            <p>square: {this.props.UIStore.square}</p>
            <button onClick={() => this.props.UIStore.increment()}>+</button>
            <button onClick={() => this.props.UIStore.decrement()}>-</button>
        </div>
      </div>
    );
  }
}

export default AppESNext;
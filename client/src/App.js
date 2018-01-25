import React, { Component } from 'react';
import Async from 'react-code-splitting';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import rootStore from './stores/RootStore';
import './App.scss';
useStrict(true);

class App extends Component {
  render() {
    return (
      <Provider {...rootStore}>
        <Router>
          <div>
            <Route
              path="/"
              exact
              component={() => <Async load={import('./views/Home')} />}
            />
            <Route
              path="/mine"
              exact
              component={() => <Async load={import('./views/Mine')} />}
            />
            <Route
              path="/login"
              exact
              component={() => <Async load={import('./views/Login')} />}
            />
            <Route
              path="/es6"
              exact
              component={() => <Async load={import('./App.ES6')} />}
            />
            <Route
              path="/esnext"
              exact
              component={() => <Async load={import('./App.ESNext')} />}
            />

            <hr />

            <ul className="router">
              <li><Link to="/">首页</Link></li>
              <li><Link to="/mine">帮助</Link></li>
              <li><Link to="/login">登录</Link></li>
              <li><Link to="/es6">Mobx ES6</Link></li>
              <li><Link to="/esnext">Mobx ESNext</Link></li>
            </ul>
          </div>
        </Router>        
      </Provider>
    );
  }
}

export default App;

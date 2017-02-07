import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux'
import App from './App.js'
import News from './components/News.js'
import TV from './components/TV.js'
import About from './components/About.js'
import Contact from './components/Contact.js'
import {polysrc} from './reducers/app.js'
import './index.css';

const store = createStore(polysrc, applyMiddleware(thunk))

render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={News}/>
        <Route path="/tv" component={TV}/>
        <Route path="/about" component={About}/>
        <Route path="/contact" component={Contact}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)

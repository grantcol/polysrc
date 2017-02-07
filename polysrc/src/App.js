import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';
import { receiveNewStories, showAlert, hideAlert, showNewStories } from './actions/app.js';
import News from './components/News.js';
import io from 'socket.io-client'
import './App.css';

const LOCALHOST = 'http://localhost:8080';
let socket = io(LOCALHOST)

class App extends Component {

  constructor(props) {
    super(props);
    socket.on(`feed-update`, data => {
      console.log('got an update', data);
      if(data.length > 0){
        this.props.receiveNewStories(data, 'complete');
        this.props.showAlert();
      };
    });
    socket.on('test-update', data => {
      console.log(data.status, data.msg);
    });
  }

  renderAlert() {
    let numStories = this.props.newStories.length > 0 ? this.props.newStories.length : "";
    let alert = this.props.alert === 'show' ? <a href="#" onClick={this.props.showNewStories}><span className="badge" style={{backgroundColor:'#d9534f'}}>{numStories}</span></a> : "";
    return alert;
  }

  renderPage() {}

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="masthead clearfix">
            <nav>
              <ul className="nav masthead-nav pull-right">
                <li role="presentation" className="active"><IndexLink to="/">News</IndexLink></li>
                <li role="presentation"><Link to="/tv">TV</Link></li>
                <li role="presentation"><Link to="/about">About</Link></li>
                <li role="presentation"><Link to="/contact">Contact</Link></li>
              </ul>
            </nav>
            <h3 className="masthead-brand text-muted">polysrc {this.renderAlert()}</h3>
          </div>
          { this.props.children }
          <footer className="footer">
            <p>&copy; 2017 polysrc</p>
          </footer>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    alert : state.alert,
    newStories : state.newStories
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    receiveNewStories: (stories, status) => {
      dispatch(receiveNewStories(stories, status))
    },
    showAlert: () => {
      dispatch(showAlert());
    },
    hideAlert: () => {
      dispatch(hideAlert());
    },
    showNewStories: () => {
      dispatch(showNewStories());
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);

import React, { Component } from 'react';
import {connect} from 'react-redux';
import {fetchStories, receiveNewStories, showAlert, hideAlert} from './actions/app.js';
import Story from './components/Story.js';
import Jumbotron from './components/Jumbotron.js';
import logo from './logo.svg';
import io from 'socket.io-client'
import './App.css';

const LOCAL_IP = '192.168.1.71:3000';
const LOCALHOST = 'http://localhost:8080';
let socket = io(`http://localhost:8080`)

class App extends Component {

  componentDidMount(){
    //console.log(this.props);
  }

  constructor(props) {
    super(props);
    this.props.fetchStories();
    socket.on(`feed-update`, data => {
      console.log('got an update', data);
      this.props.showAlert();
      //if(data.count > 0) this.props.receiveNewStories(data.stories, 'complete');
    });
    socket.on('test-update', data => {
      console.log(data.status, data.msg);
    });
  }

  getStories() {
    let self = this;
    return fetch('http://localhost:8080/stories')
            .then(function(res){ return res.json() })
            .then(function(body){
              self.setState({stories:body});
            })
            .catch(function(err){
              console.log(err)
              return [];
            });
  }

  renderAlert() {
    let alert = this.props.alert === 'show' ? <a href="#" className="btn btn-link ps-new-stories-link" onClick={this.props.hideAlert}> New Stories </a> : ""
    return alert;
  }

  renderStories() {
    let stories = this.props.stories;
    //console.log(stories[0]);
    if(stories.length > 0){
      let topStory = <Jumbotron story={stories[0]}/>
      let allStories =  []
      for(let i = 1; i < stories.length; i++) {
        allStories.push(<Story key={stories[i].url} story={stories[i]}/>)
      }
      return {'top':topStory, 'stories':allStories};
    } else {
      return {'top':[], 'stories':[]};
    }
  }

  render() {
    let stories = this.renderStories();

    return (
      <div className="App">
        <div className="container">
          <div className="header clearfix">
            <nav>
              <ul className="nav nav-pills pull-right">
                <li role="presentation" className="active"><a href="#">Home</a></li>
                <li role="presentation"><a href="#">About</a></li>
                <li role="presentation"><a href="#">Contact</a></li>
              </ul>
            </nav>
            <h3 className="text-muted">polysrc.</h3>
          </div>


          {/*<div className="jumbotron">
            <h1>Jumbotron heading</h1>
            <p className="lead">Cras justo odio, dapibus ac facilisis in, egestas eget quam. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
            <p><a className="btn btn-lg btn-success" href="#" role="button">Read</a></p>
          </div>*/}
          {this.renderAlert()}
          {stories.top}
          <div className="row marketing">
            <div className="col-lg-12">
              {stories.stories}
            </div>

            {/*<div className="col-lg-6">
              <h4>Subheading</h4>
              <p>Donec id elit non mi porta gravida at eget metus. Maecenas faucibus mollis interdum.</p>

              <h4>Subheading</h4>
              <p>Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus sit amet fermentum.</p>

              <h4>Subheading</h4>
              <p>Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
            </div>*/}
          </div>

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
    stories : state.stories,
    alert : state.alert
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchStories: () => {
      dispatch(fetchStories())
    },
    receiveNewStories: (stories, status) => {
      dispatch(receiveNewStories(stories, 'complete'))
    },
    showAlert: () => {
      dispatch(showAlert());
    },
    hideAlert: () => {
      dispatch(hideAlert());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

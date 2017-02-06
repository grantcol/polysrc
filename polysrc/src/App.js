import React, { Component } from 'react';
import {connect} from 'react-redux';
import {fetchStories, receiveNewStories, showAlert, hideAlert, showNewStories, addFilter, removeFilter} from './actions/app.js';
import Story from './components/Story.js';
import Jumbotron from './components/Jumbotron.js';
import Filters from './components/Filters.js';
import io from 'socket.io-client'
import './App.css';

const LOCALHOST = 'http://localhost:8080';
let socket = io(LOCALHOST)

class App extends Component {

  constructor(props) {
    super(props);
    this.props.fetchStories();
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

  renderFilters() {
    return this.props.stories.length > 0 ? <Filters addFilter={this.props.addFilter}/> : "";
  }

  renderAlert() {
    let numStories = this.props.newStories.length > 0 ? this.props.newStories.length : "";
    let alert = this.props.alert === 'show' ? <a href="#" onClick={this.props.showNewStories}><span className="badge" style={{backgroundColor:'#d9534f'}}>{numStories}</span></a> : "";
    return alert;
  }

  renderStories() {
    let stories = this.props.stories;
    let filter = this.props.filter;
    let activeFilters = Object.keys(filter).filter((name) => { return filter[name].active });
    if(activeFilters.length > 0){
      stories = stories.filter((story) => { return activeFilters.includes(story.source) });
    }
    if(stories.length > 0){
      let topStory = <Jumbotron story={stories[0]}/>
      let allStories =  []
      for(let i = 1; i < stories.length; i++) {
        allStories.push(<Story key={stories[i]._id} story={stories[i]}/>)
      }
      return {'top':topStory, 'stories':allStories, 'placeholder':null};
    } else {
      return {'top':[], 'stories':[], 'placeholder':<h2 style={{textAlign: "center"}}> Sorry, theres nothing to show right now </h2>};
    }
  }

  render() {
    let stories = this.renderStories();
    let placeholder = stories.placeholder;
    return (
      <div className="App">
        <div className="container">
          <div className="header clearfix">
            <nav>
              <ul className="nav nav-pills pull-right">
                <li role="presentation" className="active"><a href="#">News</a></li>
                <li role="presentation"><a href="#">TV</a></li>
                <li role="presentation"><a href="#">FM</a></li>
                <li role="presentation"><a href="#">About</a></li>
                <li role="presentation"><a href="#">Contact</a></li>
              </ul>
            </nav>
            <h3 className="text-muted">polysrc {this.renderAlert()}</h3>
          </div>

          {this.renderFilters()}
          {placeholder !== null ? placeholder : ""}
          {stories.top}
          <div className="row marketing">
            <div className="col-lg-12">
              {stories.stories}
            </div>

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
    alert : state.alert,
    newStories : state.newStories,
    filter : state.filter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchStories: () => {
      dispatch(fetchStories())
    },
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
    },
    addFilter: (channel) => {
      dispatch(addFilter(channel))
    },
    removeFilter: (channel) => {
      dispatch(removeFilter(channel))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

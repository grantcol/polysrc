import React, { Component } from 'react';
import Story from './components/Story.js';
import Jumbotron from './components/Jumbotron.js';
import logo from './logo.svg';
import './App.css';


/*function getStories(){
  return fetch('localhost:8080/stories')
          .then(function(res){ return res.text() })
          .then(function(body){

          })
}*/

class App extends Component {

  componentDidMount(){
    console.log(this.state);
  }

  constructor(props) {
    super(props);
    /*let t = this.getStories();*/
    this.state = {
      stories: []
    };
    this.getStories();
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

  renderStories() {
    let stories = this.state.stories;
    //console.log(stories[0]);
    if(stories.length > 0){
      let topStory = <Jumbotron story={stories.reverse().pop()}/>
      let allStories =  stories.map(function(story){
        return <Story story={story}/>;
      });
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

export default App;

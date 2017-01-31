import React, { Component } from 'react';

export default class Story extends React.Component {
  renderImages(){
    let s = this.props.story.media;
    return s.map(function(story){ return <img src={story.url} width={story.width} height={story.width}/>})
  }

  render() {
    console.log(this.props)
    const story = this.props.story;
    return (
      <div className="media">
        <div className="media-left">
          <a href="#">
            <img className="media-object" src={story.media[0].url} width={90} height={75}/>
          </a>
        </div>
        <div className="media-body">
          <h4 className="media-heading">{story.title}</h4>
          {story.description.split('<')[0]}
        </div>
      </div>
    )
  }
}

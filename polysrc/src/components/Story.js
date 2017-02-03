import React, { Component } from 'react';

export default class Story extends React.Component {
  renderImages(){
    let s = this.props.story.media;
    return s.map(function(story){ return <img src={story.url} width={story.width} height={story.width}/>})
  }

  render() {
    console.log(this.props)
    const story = this.props.story;
    console.log(story.media);
    let image = story.media.length > 0 ? story.media[0][0].url : 'https://image.freepik.com/free-vector/earth-design-made-of-polygons_1010-432.jpg';
    return (
      <div className="media">
        <div className="media-left">
          <a href="#">
            <img className="media-object" src={image} width={90} height={75}/>
          </a>
        </div>
        <div className="media-body">
          <h4 className="media-heading"><a href={story.url} target="_blank">{story.title}</a></h4>
          {story.description.split('<')[0]}
        </div>
      </div>
    )
  }
}

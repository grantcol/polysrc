import React, { Component } from 'react';

export default class Jumbotron extends Component {

  render() {
    const story = this.props.story;
    let image = story.media.length > 0 ? story.media[0][0].url : 'https://image.freepik.com/free-vector/earth-design-made-of-polygons_1010-432.jpg';
    let jumbotronStyle = {
      backgroundImage: 'url('+image+')',
      backgroundSize: 'cover',
      color: '#fff'
    }
    return (
      <div className="jumbotron no-pad" style={jumbotronStyle}>
        <div className="jumbotron-overlay">
        <h2>{story.title} <small><span className="label label-default">{story.source}</span></small> </h2>
        <hr/>
        <p className="lead">{story.description.split('<')[0]}</p>
        <p><a className="btn btn-lg btn-success" href={story.url} role="button" target="_blank">Read</a></p>
        </div>
      </div>
    )
  }
}

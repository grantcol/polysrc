import React, { Component } from 'react';

export default class Jumbotron extends React.Component {

  render() {
    //console.log(this.props)
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
        <h2>{story.title}</h2>
        <hr/>
        <p className="lead">{story.description.split('<')[0]}</p>
        <p><a className="btn btn-lg btn-success" href="#" role="button">Read</a></p>
        </div>
      </div>
    )
  }
}

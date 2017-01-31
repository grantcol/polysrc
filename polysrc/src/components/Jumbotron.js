import React, { Component } from 'react';

export default class Jumbotron extends React.Component {

  render() {
    console.log(this.props)
    const story = this.props.story;
    let jumbotronStyle = {
      backgroundImage: 'url('+story.media[0].url+')',
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

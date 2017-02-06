import React, { Component } from 'react';
import {connect} from 'react-redux';
import {addFilter, removeFilter} from '../actions/app.js';

class Filters extends Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.filter = this.filter.bind(this);
  }

  filter(name) {
    let filter = this.props.filter;
    console.log(filter, name);
    if(filter[name].active) {
      this.props.removeFilter(name);
    } else {
      this.props.addFilter(name);
    }
  }

  renderLabels() {
    console.log('rendering labels');
    let filter = this.props.filter;
    let labels = Object.keys(filter).map((name) => {
      //console.log(channel.bias);
      let channel = filter[name];
      let style = "";
      if(!channel.active) style = "label label-default";
      else if(channel.bias === 'd') style = "label label-primary";
      else if(channel.bias === 'r') style = "label label-danger";
      else if(channel.bias === 'm') style = "label label-warning";
      return <a href="#" key={name} style={{marginRight:'5px'}} onClick={ () => {this.filter(name)} }><span className={style}> {name} </span></a>
    });
    return labels;
  }

  render() {
    return (
      <div style={{textAlign:'center', marginBottom: '15px', marginTop: '0px'}}>
        {this.renderLabels()}
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    filter : state.filter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addFilter: (channel) => {
      dispatch(addFilter(channel))
    },
    removeFilter: (channel) => {
      dispatch(removeFilter(channel))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);

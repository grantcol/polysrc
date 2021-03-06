import * as constants from '../constants/appTypes.js';

export function showAlert(){
  return {
    type : constants.SHOW_ALERT,
    alert : 'show'
  }
}

export function hideAlert(){
  return {
    type : constants.HIDE_ALERT,
    alert : 'hide'
  }
}

export function getStories(){
  return {
    type : constants.GET_STORIES,
    status : 'pending'
  }
}

export function receiveStories(stories, status){
  return {
    type : constants.RECEIVE_STORIES,
    stories : stories,
    status : status
  }
}

export function getStory(id){
  return {
    type : constants.GET_STORY,
    id : id
  }
}

export function receiveStory(story, status){
  return {
    type : constants.RECEIVE_STORY,
    story : story,
    status : status
  }
}

export function receiveNewStories(stories, status) {
  return {
    type : constants.RECEIVE_NEW_STORIES,
    stories : stories,
    status : status,
    count : stories.length
  }
}

export function showNewStories() {
  return {
    type : constants.SHOW_NEW_STORIES
  }
}

export function getChannel(channel) {
  return {
    type : constants.GET_CHANNEL,
    channel : channel,
    status : 'pending'
  }
}

export function receiveChannel(channel, status) {
  return {
    type : constants.RECEIVE_CHANNEL,
    channel : channel,
    status : status
  }
}

export function addFilter(channel) {
  return {
    type : constants.ADD_FILTER,
    channel : channel
  }
}

export function removeFilter(channel) {
  return {
    type : constants.REMOVE_FILTER,
    channel : channel
  }
}

export function fetchStories() {
  return dispatch => {
    dispatch(getStories())
    fetch('http://localhost:8080/stories')
          .then(function(response){ return response.json() })
          .then(function(json){
             console.log(json);
            dispatch(receiveStories(json, 'complete'))
          })
          .catch(function(err){
            console.log(err)
            dispatch(receiveStories([], 'error'))
          });
  }
}

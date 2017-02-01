import * as constants from '../constants/appTypes.js';

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

export function fetchStories() {
  return dispatch => {
    dispatch(getStories())
    fetch('http://localhost:8080/stories')
          .then(function(response){ return response.json() })
          .then(function(json){
            dispatch(receiveStories(json, 'complete'))
          })
          .catch(function(err){
            console.log(err)
            dispatch(receiveStories([], 'error'))
          });
  }
}

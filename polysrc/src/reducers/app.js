import * as constants from '../constants/appTypes.js';

const initialState = {
  stories : [],
  alert : 'hide',
  newStories : [],
  filter : constants.filters
}

export function polysrc(state = initialState, action) {
  switch(action.type) {
    case constants.GET_STORIES :
      return Object.assign({}, state, {
        status: action.status
      });
    case constants.RECEIVE_STORIES :
      return Object.assign({}, state, {
        stories : action.stories,
        status : action.status
      });
    case constants.RECEIVE_NEW_STORIES :
      return Object.assign({}, state, {
        newStories : action.stories,
        status : action.status
      });
    case constants.SHOW_NEW_STORIES :
      let oldStories = state.stories;
      let newStories = state.newStories
      return Object.assign({}, state, {
        stories : newStories.concat(oldStories),
        alert : 'hide'
      });
    case constants.GET_STORY :
      return Object.assign({}, state, {
        status : action.status
      });
    case constants.RECEIVE_STORY :
      let stories = Object.assign([], action.stories).concat(action.story);
      return Object.assign({}, state, {
        stories : stories,
        status : action.status
      });
    case constants.SHOW_ALERT:
      return Object.assign({}, state, {
        alert: action.alert
      });
    case constants.HIDE_ALERT:
      return Object.assign({}, state, {
        alert: action.alert
      });
    case constants.ADD_FILTER:
    {
      let _filter = Object.assign({}, state.filter);
      let keys = Object.keys(_filter);
      keys.forEach((key) => {
        if(key === action.channel){
          _filter[key].active = true;
        }
      });
      return Object.assign({}, state, {filter:_filter});
    }

    case constants.REMOVE_FILTER:
    {
      let filter = Object.assign({}, state.filter);
      let keys = Object.keys(filter);
      keys.forEach((key) => {
        if(key === action.channel){
          filter[key].active = false;
        }
      });
      return Object.assign({}, state, {filter:filter});
    }
    default:
      return state;
  }
}

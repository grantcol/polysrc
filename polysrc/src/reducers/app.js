import * as constants from '../constants/appTypes.js';

const initialState = {
  stories : [],
  alert: 'hide'
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
        stories : action.stories.concat(state.stories),
        status : action.status
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
    default:
      return state;
  }
}

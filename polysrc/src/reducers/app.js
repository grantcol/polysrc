import * as constants from '../constants/appTypes.js';

const initialState = {
  stories : []
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
    default:
      return state;
  }
}

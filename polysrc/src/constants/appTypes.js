export const GET_STORIES = 'GET_STORIES';
export const GET_STORY = 'GET_STORY';
export const GET_CHANNEL = 'GET_STORY_FROM_FEED';
export const GET_TOPICS = 'GET_TOPICS';
export const GET_TOPIC = 'GET_TOPIC';
export const RECEIVE_STORIES = 'RECEIVE_STORIES';
export const RECEIVE_NEW_STORIES = 'RECEIVE_NEW_STORIES';
export const SHOW_NEW_STORIES = 'SHOW_NEW_STORIES'
export const RECEIVE_STORY = 'RECEIVE_STORY';
export const RECEIVE_CHANNEL= 'RECEIVE_STORY_FROM_FEED';
export const RECEIVE_TOPICS = 'RECEIVE_TOPICS';
export const RECEIVE_TOPIC = 'RECEIVE_TOPIC';
export const SHOW_ALERT = 'SHOW_ALERT';
export const HIDE_ALERT = 'HIDE_ALERT';
export const ADD_FILTER = 'ADD_FILTER';
export const REMOVE_FILTER = 'REMOVE_FILTER';

export const filters = {
  'cnn' : {active:false, bias:'d'},
  'npr' : {active:false, bias: 'd'},
  'bbc' : {active:false, bias:'m'},
  'hill' : {active:false, bias:'m'},
  'breitbart' : {active:false, bias:'r'},
  'fox' : {active:false, bias:'r'}
}

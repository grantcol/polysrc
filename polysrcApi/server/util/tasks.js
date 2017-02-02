import later from 'later';
import {updatePayload, allChannels} from '../data/localData.js';
require('es6-promise').polyfill();
require('isomorphic-fetch');

export function checkFeeds(feeds = [], env = 'DEV', update = null) {
  switch(env){
    case 'DEV' :
      if(feeds.length <= 0) {
        let channels = allChannels;
      } else {
        let channels = Object.keys(allChannels).map(function(key){
          //if channel name exists in feeds return allChannels[key]
        });
      }
      //fetch all the data from the channels
      let payload = updatePayload;
      //emit from socketio and store in mongo here so it can be unsupervised
      if(!!update) {
        update(payload);
      }
    case 'PROD' :
      return [];
    default :
      return [];
  }
}

export function fetchNews(name, url) {
    console.log(`fetching new news from ${name} @ ${url}`);
    return fetch(url)
            .then(function(result){ return res.text() })
            .then(function(body){
              console.log(body);
            })
            .catch(function(err){
              console.log(err)
            });
}

export function configureSchedule() {
    //configure a later object here and return it for server
}

export function emitFeedUpdate(socket, payload) {
  socket.emit('feed-update', payload);
}

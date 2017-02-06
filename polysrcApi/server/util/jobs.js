import mongoose from 'mongoose'; //may not be necessary
import { DB_URI } from '../polysrc_config';
import Story from '../models/Story';
import Channel from '../models/Channel';
import { fetchFeeds, getStoriesAfter, updateBuildDates } from './tasks';

export function updateFeed(socket = null){
  Channel.find({}).exec()
  .then((docs) => {
    console.log(`preparing to fetch from ${docs.length} sources ...`);
    let now = Date.now(); //save the current time so we can look up the newly fetched stories
    fetchFeeds(docs)
    .then((storyModels) => {
      Promise.all(storyModels)
      .then((stories) => {
        console.log(`${stories.length} STORIES RETURNED`);
        //once we've saved all the stories we can update the channel object with a new builddate
        //this actually returns stories for us to send to the client
        if(stories.length > 0) {
          if(socket !== null) { socket.emit('feed-update', stories); }
          else { console.log('no socket supplied!'); }
          updateBuildDates()
        }
      })
    })
    .catch((err) => { console.log('error fetching the feeds!', err); });
  })
  .catch((err) => { console.log('error quering the db!', err); });
}

export function testUpdate(interval, socket = null) {
  //if(socket === null) return false;
  return setInterval(() => {
    console.log('checking for new stuff');
    console.log('found some new stuff');
  
  }, interval);
}


//let d2 = new Date('2017-02-03T23:27:00.000Z')

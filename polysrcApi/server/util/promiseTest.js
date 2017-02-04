import mongoose from 'mongoose';
import { DB_URI } from '../polysrc_config.js';
import Story from '../models/Story.js';
import Channel from '../models/Channel.js';

mongoose.Promise = global.Promise;
mongoose.connect(DB_URI, (err) => { if(err) console.log(err) });

function testPromiseChain(){
  fetchStories()
  .then((docs) => {
    let saveAll = saveStories(docs);
    console.log('SAVE ALL PROMISE', saveAll);
    saveAll.then((result) => {
              console.log("RESULT OF SAVING ALL THE MODELS", result.length);
              return result.map((r) => { return r.title; });
            })
           .then((names) => { console.log('article names', names); })
           .catch((err) => { console.log('error saving all!', err) })
  })
}

function fetchStories(){
  console.log('fetching the stories!');
  return Story.find({}).sort({pubDate:-1}).limit(5).exec().then((docs) => { return docs });
}

function saveStories(docs){
  console.log('DOCS HANDED OFF', docs.length);
  let saves = docs.map((doc) => { return doc.save() });
  console.log('SAVE PROMISES', saves.length);
  return Promise.all(saves);
}

console.log('begining promise test', DB_URI)
testPromiseChain();

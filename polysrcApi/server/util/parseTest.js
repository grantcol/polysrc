import {makeStory, makeChannel} from "./modelGenerators.js";
import {parseString} from "xml2js";
require('es6-promise').polyfill();
require('isomorphic-fetch');
import mongoose from "mongoose";
import Channel from '../models/Channel.js';
import fs from 'fs';

/*
Takes in a url to local json and returns a document id for mlab db
*/
export function testStory(url) {
  let obj = JSON.parse(fs.readFileSync(url, 'utf8'));
  let s = story(obj);
  console.log(s);
}

export function updateChannel(id){
  mongoose.connect("mongodb://grantcol:weezybaby21@ds137759.mlab.com:37759/polysrc");
  Channel.findOne({shortName:id}, function(err, doc){
    if(!err){
      //console.log(doc);
      update(doc);
    }
    else{
      console.log(err);
    }
  });
}

export function updateAll(){

}

export function updateChannels(ids){
  ids.forEach(function(id){
    Channel.findOne({shortName:id}, function(err, doc){
      if(!err){
        console.log(doc);
        update(doc);
      }
      else{
        console.log(err);
      }
    });
  });
}

export function update(channel) {
  let id = channel._id;
  let url = channel.rss;

  fetch(url)
  .then(function(res){
    return res.text();
  })
  .then(function(body){
    parseString(body, function(err, result){
      let items = result.rss.channel[0].item;
      console.log(items.length);
      items.forEach(function(item){
        //console.log(item);
        let story = makeStory(item, id);
        story.save(function(err){
          if(err) {
            console.log('error', err);
          } else {
            console.log('success');
          }
        })
      })
    })
  })
  .catch(function(err){ console.log(err); });
}

export function fetchChannels() {
  mongoose.connect("mongodb://grantcol:weezybaby21@ds137759.mlab.com:37759/polysrc");
  let channels = JSON.parse(fs.readFileSync("/Users/grantcollins/dev/source/polysourceReact/server/data/channels.json", 'utf8'));
  Object.keys(channels).forEach(function(key){
    console.log(key, channels[key])
    fetch(channels[key])
            .then(function(res){
              return res.text();
            })
            .then(function(body){
              parseString(body, function (err, result) {
                let c = makeChannel(result.rss.channel[0], channels[key], key);
                console.log(c);
                c.save(function(err){
                  if(!err){
                    console.log('success');
                  } else {
                    console.log('error saving the doc', err);
                  }
                });
              });
              return body;
            }).catch(function(err){return err;});
  });
}

function getMediaRss(url) {
  return fetch(url)
  .then((result) => { return result.text() })
  .then((body) => {console.log(body)})
  .catch((err) => {console.error(err)});
}
getMediaRss('http://rss.cnn.com/rss/cnn_freevideo.mrss');
//updateChannel('cnn');

import Story from '../models/Story';
import Channel from '../models/Channel';
import { updatePayload, allChannels, channelIds } from '../data/localData.js';
import { makeStory, extractImages } from './modelGenerators.js';
import * as parser from 'xml2json';
import mongoose from 'mongoose';
import fs from 'fs';
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://grantcol:weezybaby21@ds137759.mlab.com:37759/polysrc");

require('es6-promise').polyfill();
require('isomorphic-fetch');

export function fetchFeeds(channels) {
    let promises = [];
    //let channels = Object.keys(allChannels);
    channels.forEach(function(channel){
      //console.log(channel);
      let url = channel.rss;
      let name = channel.shortName;
      promises.push(fetchNews(name, url, channel.lastBuildDate));
    });
    Promise.all(promises).then(data => {
      //parse new data and send down the new stuff
      let json = data.map((entry) => {
        //let jsonEntry = { name : entry.name, json : parser.toJson(entry.xml, {object:true}) };
        console.log(entry.lastBuildDate)
        return { name : entry.name, json : parser.toJson(entry.xml, {object:true}), lastBuildDate: entry.lastBuildDate};
      });
      //let writable = JSON.stringify({'values':json});
      //fs.writeFile(`${__dirname}/../data/stories.json`, writable, 'utf8', function(){ console.log('done') });
      json.forEach((channel) => {
        injestNews(channel.name, channel.json, channel.lastBuildDate);
      })
    });
}

export function testFetchFeeds() {
    let jstr = fs.readFileSync(`${__dirname}/../data/stories.json`, 'utf8');
    let json = JSON.parse(jstr)
    json.values.forEach((value) => {
      let name = value.name;
      let json = value.json;
      let stories = json.rss.channel.item;
      let storyModels = stories.map((story) => {
        return makeStory(story);
      });
      console.log(storyModels);
    });

}

export function injestNews(name, json, lastBuildDate) {
  console.log(`injesting news from ${name}`);
  let stories = json.rss.channel.item;
  let storyModels = stories.map((story) => {
    if(new Date(story.pubDate) > new Date(lastBuildDate)){
      let storyModel =  makeStory(story, channelIds[name]);
      console.log(`\t id: ${storyModel._id} title: ${storyModel.title}`)
      return storyModel.save();
    }
  });
  //console.log(storyModels);
  Promise.all(storyModels)
         .then((result) => {
           console.log('RESULTS \n', result)
           updateLastBuildDate(name);
         })
         .catch((err) => {
           console.log(err)
         })
}

export function fetchNews(name, url, lastBuildDate) {
    console.log(`fetching new news from ${name} @ ${url}`);
    return fetch(url)
            .then((result) => result.text())
            .then((xml) => { return { 'name':name, 'xml':xml, lastBuildDate: lastBuildDate } } )
            .catch((err) => err);
}

export function setLastUpdate(channels) {
  //channels is a list of names of the channels to check out
  channels.forEach((channel) => {
    //Tank.find({ size: 'small' }).where('createdDate').gt(oneYearAgo).exec(callback);
    Channel.findOne({shortName:channel})
            .exec((err, doc) => {
              console.log(doc.shortName, doc.stories.length);
              /*let first = doc.stories[0];
              for(let i = 1; i < doc.stories.length; i++) {
                let d1 = new Date(first.pubDate);
                let d2 = new Date(doc.stories[i].pubDate);
                console.log(first.pubDate, doc.stories[i].pubDate, d1, d2, d1 < d2, d1 > d2);
              }*/
            });
  })
}
/*let first = doc.stories[0];
for(let i = 1; i < doc.stories.length; i++) {
  let d1 = new Date(first.pubDate);
  let d2 = new Date(doc.stories[i].pubDate);
  console.log(first.pubDate, doc.stories[i].pubDate, d1, d2, d1 < d2, d1 > d2);
}*/
export function killDupeChilds(err, doc) {
  console.log(err, doc.shortName, doc.stories.length);
  let dupes = {}
  let del = [];
  let stories = Object.assign([], doc.stories);
  stories.forEach((story, idx) => {
    if(dupes[story] === undefined){
    //  console.log(dupes[story]);
      dupes[story] = story;
    } else {
      doc.stories.pull(story);
    }
  });
  console.log(del.length, Object.keys(dupes).length);
  doc.save((err) => {if(!err){console.log("success")}});
}

export function getStory() {
  Story.find({}).populate('_creator').sort({pubDate:-1}).exec((err, docs) => {
    if(!err){
      console.log(docs.length);
      docs.forEach((doc) => {
        let creator = doc._creator;
        doc.source = creator.shortName;
        doc.save()
        //creator.stories.push(doc);
        //creator.save((err) => {console.log('saved', doc.title);});
      })
    }
  });
  return;
}

export function updateLastBuildDate(channel) {
  Story.findOne({source: channel}).populate('_creator').sort({pubDate:-1}).exec((err, doc) => {
    if(!err) {
      doc._creator.lastBuildDate = doc.pubDate;
      doc._creator.save((err) => {console.log('updated successfully bruh')});
    }
  })
}

export function removeChannel(channel) {
  Story.find({}).populate('_creator').exec((err, docs) => {
    console.log(docs.length);
    docs.forEach((doc) => {
      if(doc._creator.shortName === channel){
        doc.remove((removed) => {console.log('removed')});
      }
    })
  })
}
//removeChannel('drudge');
/*Channel.find({}).exec().then((docs) => {
  console.log(docs)
  fetchFeeds(docs);
});*/
//['cnn', 'fox', 'npr', 'breitbart', 'bbc', 'slate', 'hill'].forEach((channel) => { updateLastBuildDate(channel) });
//setLastUpdate(['cnn', 'fox', 'npr', 'breitbart', 'bbc', 'slate', 'hill', 'drudge']);
//fetchFeeds();

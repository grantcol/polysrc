import Story from '../models/Story';
import Channel from '../models/Channel';
import { updatePayload, allChannels, channelIds } from '../data/localData.js';
import { makeStory, extractImages } from './modelGenerators.js';
import * as parser from 'xml2json';
import mongoose from 'mongoose';
import fs from 'fs';
import moment from 'moment';
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://grantcol:weezybaby21@ds137759.mlab.com:37759/polysrc");

require('es6-promise').polyfill();
require('isomorphic-fetch');

export function fetchFeeds(channels) {
    let promises = [];
    channels.forEach(function(channel){
      /*let url = channel.rss;
      let name = channel.shortName;*/
      let { rss:url, shortName:name, lastBuildDate } = channel;
      //console.log('NAME', name)
      promises.push(fetchNews(name, url, lastBuildDate));
    });
    return Promise.all(promises).then(data => {
      //injest the new news and return an array of story.save() promises
      let injested =[];
      data.forEach((entry) => {
        let { name, lastBuildDate, xml } = entry;
        let json = parser.toJson(xml, {object:true});
        injested = injested.concat(injestNews(name, json, lastBuildDate));
      });
      //injested is an array of Promises from injestNews(channels) for each channel that we can return for the caller to finish up its work
      return injested;
    });
}


export function injestNews(name, json, lastBuildDate) {
  console.log(`injesting news from ${name}`);
  let stories = json.rss.channel.item;
  let storyModels = [];
  stories.forEach((story) => {
    if(moment(story.pubDate).isAfter(moment(lastBuildDate))){
      let storyModel = makeStory(story, channelIds[name], name);
      console.log(`\t id: ${storyModel._id} title: ${storyModel.title}`)
      storyModels.push(storyModel.save());
    }
  });
  return storyModels;
}

export function fetchNews(name, url, lastBuildDate) {
    console.log(`fetching new news from ${name} @ ${url}`);
    return fetch(url)
            .then((result) => result.text())
            .then((xml) => { return { 'name':name, 'xml':xml, lastBuildDate: lastBuildDate } } )
            .catch((err) => err);
}

/*
  intended use is like so
  updateBuildDates()
    .then((result) => {
    console.log(result);
      //do something
    })
    .catch((err) => {
      console.log(err)
    });
*/
export function updateBuildDates() {
  return Channel.find({})
         .exec()
         .then((docs) => { return docs.map((doc) => { return updateBuildDate(doc.shortName) }); })
         //.then((docPromises) => { return Promise.all(docPromises); })
         //.then((docs) => { console.log('successfully updated pubDates') })
         .catch((err) => { console.log('error in updating pubDates')});
}

export function updateBuildDate(channel) {
    Story.findOne({source:channel})
    .populate('_creator')
    .sort({pubDate:-1})
    .exec()
    .then((doc) => {
      //.format("dddd, MMMM Do YYYY, h:mm:ss a")
      let source = moment(doc._creator.lastBuildDate);
      let date = moment(doc.pubDate);
      let isAfter = date.isAfter(source);
      if(isAfter) {
        doc._creator.lastBuildDate = new Date(doc.pubDate);
        //console.log(doc._creator.shortName, moment(doc._creator.lastBuildDate).format("dddd, MMMM Do YYYY, h:mm:ss a"))
        doc._creator.save((err) => {
          if(err) console.log(err)
          else console.log(doc._creator.shortName, moment(doc._creator.lastBuildDate).format("dddd, MMMM Do YYYY, h:mm:ss a"));
        });
      }
    });
}

export function getChannelStories(channel) {
  return Story.findOne({source:channel})
              .populate('_creator')
              .sort({pubDate:-1})
              .exec()
              .then((doc) => {
                console.log(doc._creator.shortName, moment(doc.pubDate).format("dddd, MMMM Do YYYY, h:mm:ss a"), moment(doc._creator.lastBuildDate).format("dddd, MMMM Do YYYY, h:mm:ss a"))
                doc._creator.lastBuildDate = new Date(doc.pubDate);
                return doc._creator.save()
              })
              .catch((err) => {console.log(err)});
}

export function getStoriesAfter(dateTime) {
    return Stories.find({ created_at: { $gt: dateTime }})
                  .populate('_creator')
                  .sort({ pubDate:-1 })
                  .exec()
                  .then((docs) => { return docs; })
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

/*********************************************************/
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
        doc.save((err) => {console.log('saved');})
      })
    }
  });
}

export function deDupeUrl(stories) {
    let dupes = {}
    stories.forEach((story) => {
      if(dupes[story.url] === undefined) {
        //if no entry exists yet then add an entry
        dupes[story.url] = story;
      } else if ( moment(dupes[story.url].pubDate).isBefore(moment(story.pubDate)) ) {
        //if the duplicate is newer than replace the one that exists
        dupes[story.url] = story;
      } else {
        //remove it from the db
        Story.findById(story._id, (err, doc) => {
          if(!err){
            if(doc !== undefined) doc.remove();
          }
        });
      }
    });
    let deDupedStories = Object.keys(dupes).map((key) => { return dupes[key]; });
    return deDupedStories;
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

export function cleanDB() {
  Story.find({}).exec((err, docs) => {
    docs.forEach((doc) => {
      if(doc.source === undefined) {
        doc.remove((removed) => {console.log('removed')});
      }
    })
  })
}


//getStory();
//updateBuildDates();
//cleanDB();
//['cnn', 'fox', 'npr', 'breitbart', 'bbc', 'slate', 'hill'].forEach((channel) => {updateBuildDate(channel)});
//updateBuildDates();
//removeChannel('drudge');
/*Channel.find({}).exec().then((docs) => {
  console.log(docs)
  fetchFeeds(docs);
});*/
//['cnn', 'fox', 'npr', 'breitbart', 'bbc', 'slate', 'hill'].forEach((channel) => { updateLastBuildDate(channel) });
//setLastUpdate(['cnn', 'fox', 'npr', 'breitbart', 'bbc', 'slate', 'hill', 'drudge']);
//fetchFeeds();

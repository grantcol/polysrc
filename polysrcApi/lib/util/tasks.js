'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchFeeds = fetchFeeds;
exports.injestNews = injestNews;
exports.fetchNews = fetchNews;
exports.updateBuildDates = updateBuildDates;
exports.updateBuildDate = updateBuildDate;
exports.getChannelStories = getChannelStories;
exports.getStoriesAfter = getStoriesAfter;
exports.testFetchFeeds = testFetchFeeds;
exports.killDupeChilds = killDupeChilds;
exports.getStory = getStory;
exports.removeChannel = removeChannel;
exports.cleanDB = cleanDB;

var _Story = require('../models/Story');

var _Story2 = _interopRequireDefault(_Story);

var _Channel = require('../models/Channel');

var _Channel2 = _interopRequireDefault(_Channel);

var _localData = require('../data/localData.js');

var _modelGenerators = require('./modelGenerators.js');

var _xml2json = require('xml2json');

var parser = _interopRequireWildcard(_xml2json);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;
_mongoose2.default.connect("mongodb://grantcol:weezybaby21@ds137759.mlab.com:37759/polysrc");

require('es6-promise').polyfill();
require('isomorphic-fetch');

function fetchFeeds(channels) {
  var promises = [];
  channels.forEach(function (channel) {
    /*let url = channel.rss;
    let name = channel.shortName;*/
    var url = channel.rss,
        name = channel.shortName,
        lastBuildDate = channel.lastBuildDate;
    //console.log('NAME', name)

    promises.push(fetchNews(name, url, lastBuildDate));
  });
  return Promise.all(promises).then(function (data) {
    //injest the new news and return an array of story.save() promises
    var injested = [];
    data.forEach(function (entry) {
      var name = entry.name,
          lastBuildDate = entry.lastBuildDate,
          xml = entry.xml;

      var json = parser.toJson(xml, { object: true });
      injested = injested.concat(injestNews(name, json, lastBuildDate));
    });
    //injested is an array of Promises from injestNews(channels) for each channel that we can return for the caller to finish up its work
    return injested;
  });
}

function injestNews(name, json, lastBuildDate) {
  console.log('injesting news from ' + name);
  var stories = json.rss.channel.item;
  var storyModels = [];
  stories.forEach(function (story) {
    if ((0, _moment2.default)(story.pubDate).isAfter(lastBuildDate)) {
      var storyModel = (0, _modelGenerators.makeStory)(story, _localData.channelIds[name], name);
      console.log('\t id: ' + storyModel._id + ' title: ' + storyModel.title);
      storyModels.push(storyModel.save());
    }
  });
  //console.log(storyModels);
  return storyModels;
}

function fetchNews(name, url, lastBuildDate) {
  console.log('fetching new news from ' + name + ' @ ' + url);
  return fetch(url).then(function (result) {
    return result.text();
  }).then(function (xml) {
    return { 'name': name, 'xml': xml, lastBuildDate: lastBuildDate };
  }).catch(function (err) {
    return err;
  });
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
function updateBuildDates() {
  return _Channel2.default.find({}).exec().then(function (docs) {
    return docs.map(function (doc) {
      return getChannelStories(doc.shortName);
    });
  }).then(function (docPromises) {
    return Promise.all(docPromises);
  }).then(function (docs) {
    console.log('successfully updated pubDates');
  }).catch(function (err) {
    console.log('error in updating pubDates');
  });
}

function updateBuildDate(channel) {
  _Story2.default.find({ source: channel }).populate('_creator').sort({ pubDate: -1 }).exec().then(function (docs) {
    //.format("dddd, MMMM Do YYYY, h:mm:ss a")
    var source = (0, _moment2.default)(docs[0]._creator.lastBuildDate);
    docs.forEach(function (doc) {
      var date = (0, _moment2.default)(doc.pubDate);
      var isAfter = date.isAfter(source);
      if (isAfter) {
        doc._creator.lastBuildDate = new Date(doc.pubDate);
        doc._creator.save(function (err) {
          if (err) console.log(err);else console.log(_doc._creator.lastBuildDate);
        });
      }
    });
  });
}

function getChannelStories(channel) {
  return _Story2.default.findOne({ source: channel }).populate('_creator').sort({ pubDate: -1 }).exec().then(function (doc) {
    console.log(doc._creator.shortName, (0, _moment2.default)(doc.pubDate).format("dddd, MMMM Do YYYY, h:mm:ss a"), (0, _moment2.default)(doc._creator.lastBuildDate).format("dddd, MMMM Do YYYY, h:mm:ss a"));
    doc._creator.lastBuildDate = new Date(doc.pubDate);
    return doc._creator.save();
  }).catch(function (err) {
    console.log(err);
  });
}

function getStoriesAfter(dateTime) {
  return Stories.find({ created_at: { $gt: dateTime } }).populate('_creator').sort({ pubDate: -1 }).exec().then(function (docs) {
    return docs;
  });
}

function testFetchFeeds() {
  var jstr = _fs2.default.readFileSync(__dirname + '/../data/stories.json', 'utf8');
  var json = JSON.parse(jstr);
  json.values.forEach(function (value) {
    var name = value.name;
    var json = value.json;
    var stories = json.rss.channel.item;
    var storyModels = stories.map(function (story) {
      return (0, _modelGenerators.makeStory)(story);
    });
    console.log(storyModels);
  });
}

/*********************************************************/
function killDupeChilds(err, doc) {
  console.log(err, doc.shortName, doc.stories.length);
  var dupes = {};
  var del = [];
  var stories = Object.assign([], doc.stories);
  stories.forEach(function (story, idx) {
    if (dupes[story] === undefined) {
      //  console.log(dupes[story]);
      dupes[story] = story;
    } else {
      doc.stories.pull(story);
    }
  });
  console.log(del.length, Object.keys(dupes).length);
  doc.save(function (err) {
    if (!err) {
      console.log("success");
    }
  });
}

function getStory() {
  _Story2.default.find({}).populate('_creator').sort({ pubDate: -1 }).exec(function (err, docs) {
    if (!err) {
      console.log(docs.length);
      docs.forEach(function (doc) {
        var creator = doc._creator;
        doc.source = creator.shortName;
        doc.save(function (err) {
          console.log('saved');
        });
      });
    }
  });
}

function removeChannel(channel) {
  _Story2.default.find({}).populate('_creator').exec(function (err, docs) {
    console.log(docs.length);
    docs.forEach(function (doc) {
      if (doc._creator.shortName === channel) {
        doc.remove(function (removed) {
          console.log('removed');
        });
      }
    });
  });
}

function cleanDB() {
  _Story2.default.find({}).exec(function (err, docs) {
    docs.forEach(function (doc) {
      if (doc.source === undefined) {
        doc.remove(function (removed) {
          console.log('removed');
        });
      }
    });
  });
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
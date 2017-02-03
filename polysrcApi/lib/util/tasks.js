'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchFeeds = fetchFeeds;
exports.testFetchFeeds = testFetchFeeds;
exports.injestNews = injestNews;
exports.fetchNews = fetchNews;
exports.setLastUpdate = setLastUpdate;
exports.killDupeChilds = killDupeChilds;
exports.getStory = getStory;
exports.updateLastBuildDate = updateLastBuildDate;
exports.removeChannel = removeChannel;

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;
_mongoose2.default.connect("mongodb://grantcol:weezybaby21@ds137759.mlab.com:37759/polysrc");

require('es6-promise').polyfill();
require('isomorphic-fetch');

function fetchFeeds(channels) {
  var promises = [];
  //let channels = Object.keys(allChannels);
  channels.forEach(function (channel) {
    console.log(channel);
    var url = channel.rss;
    var name = channel.shortName;
    promises.push(fetchNews(name, url, channel.lastBuildDate));
  });
  Promise.all(promises).then(function (data) {
    //parse new data and send down the new stuff
    var json = data.map(function (entry) {
      //let jsonEntry = { name : entry.name, json : parser.toJson(entry.xml, {object:true}) };
      console.log(entry.lastBuildDate);
      return { name: entry.name, json: parser.toJson(entry.xml, { object: true }), lastBuildDate: entry.lastBuildDate };
    });
    //let writable = JSON.stringify({'values':json});
    //fs.writeFile(`${__dirname}/../data/stories.json`, writable, 'utf8', function(){ console.log('done') });
    json.forEach(function (channel) {
      injestNews(channel.name, channel.json, channel.lastBuildDate);
    });
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

function injestNews(name, json, lastBuildDate) {
  console.log('injesting news from ' + name);
  var stories = json.rss.channel.item;
  var storyModels = stories.map(function (story) {
    if (new Date(story.pubDate) > new Date(lastBuildDate)) {
      var storyModel = (0, _modelGenerators.makeStory)(story, _localData.channelIds[name]);
      console.log('\t id: ' + storyModel._id + ' title: ' + storyModel.title);
      return storyModel.save();
    }
  });
  //console.log(storyModels);
  Promise.all(storyModels).then(function (result) {
    console.log('RESULTS \n', result);
    updateLastBuildDate(name);
  }).catch(function (err) {
    console.log(err);
  });
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

function setLastUpdate(channels) {
  //channels is a list of names of the channels to check out
  channels.forEach(function (channel) {
    //Tank.find({ size: 'small' }).where('createdDate').gt(oneYearAgo).exec(callback);
    _Channel2.default.findOne({ shortName: channel }).exec(function (err, doc) {
      console.log(doc.shortName, doc.stories.length);
      /*let first = doc.stories[0];
      for(let i = 1; i < doc.stories.length; i++) {
        let d1 = new Date(first.pubDate);
        let d2 = new Date(doc.stories[i].pubDate);
        console.log(first.pubDate, doc.stories[i].pubDate, d1, d2, d1 < d2, d1 > d2);
      }*/
    });
  });
}
/*let first = doc.stories[0];
for(let i = 1; i < doc.stories.length; i++) {
  let d1 = new Date(first.pubDate);
  let d2 = new Date(doc.stories[i].pubDate);
  console.log(first.pubDate, doc.stories[i].pubDate, d1, d2, d1 < d2, d1 > d2);
}*/
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
        doc.save();
        //creator.stories.push(doc);
        //creator.save((err) => {console.log('saved', doc.title);});
      });
    }
  });
  return;
}

function updateLastBuildDate(channel) {
  _Story2.default.findOne({ source: channel }).populate('_creator').sort({ pubDate: -1 }).exec(function (err, doc) {
    if (!err) {
      doc._creator.lastBuildDate = doc.pubDate;
      doc._creator.save(function (err) {
        console.log('updated successfully bruh');
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
removeChannel('drudge');
/*Channel.find({}).exec().then((docs) => {
  console.log(docs)
  fetchFeeds(docs);
});*/
//['cnn', 'fox', 'npr', 'breitbart', 'bbc', 'slate', 'hill'].forEach((channel) => { updateLastBuildDate(channel) });
//setLastUpdate(['cnn', 'fox', 'npr', 'breitbart', 'bbc', 'slate', 'hill', 'drudge']);
//fetchFeeds();
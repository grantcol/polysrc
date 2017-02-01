"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeStory = makeStory;
exports.makeChannel = makeChannel;

var _Story = require("../models/Story.js");

var _Story2 = _interopRequireDefault(_Story);

var _Channel = require("../models/Channel.js");

var _Channel2 = _interopRequireDefault(_Channel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import getImages from "./parse.js";
//import sanitize from "./parse.js";

function makeStory(raw, source) {
  //console.log(raw);
  //console.log(raw.title[0], raw.author,raw.description, raw.pubDate,raw.guid, raw.link)
  var story = new _Story2.default({
    title: raw.title[0],
    author: !raw.author ? 'N/A' : raw.author[0],
    description: raw.description[0],
    url: raw.link[0],
    guid: raw.guid[0]['_'],
    category: 'Politics',
    pubDate: raw.pubDate[0],
    media: getImages(raw),
    _creator: source //id of the channel who created it
  });
  return story;
}

function makeChannel(raw, rss, name) {
  //console.log('making a new channel', raw.title[0], raw.description[0], raw.link[0]);
  var channel = new _Channel2.default({
    title: raw.title[0],
    description: raw.description[0],
    bias: "N/A",
    url: raw.link[0],
    rss: rss,
    shortName: name
  });
  //console.log(channel);
  return channel;
}

function getImages(json) {
  console.log("YOOOO", json['media:group'][0]['media:content']);
  var media = json['media:group'][0]['media:content'];
  if (media.length > 0) {
    var content = media.map(function (m) {
      return m.$;
    });
    return content;
  } else {
    return [];
  }
}

function sanitize(str, delim) {
  return str.split(delim)[0];
}
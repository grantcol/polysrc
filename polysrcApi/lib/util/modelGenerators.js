"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.makeStory = makeStory;
exports.makeChannel = makeChannel;
exports.extractImages = extractImages;

var _Story = require("../models/Story.js");

var _Story2 = _interopRequireDefault(_Story);

var _Channel = require("../models/Channel.js");

var _Channel2 = _interopRequireDefault(_Channel);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function makeStory(raw, source, sourceName) {
  var story = new _Story2.default({
    title: raw.title,
    author: !raw['dc:creator'] ? 'N/A' : raw['dc:creator'],
    description: raw.description,
    url: raw.link,
    category: 'Politics',
    pubDate: raw.pubDate,
    media: extractImages(raw),
    source: sourceName,
    _creator: str2ObjId(source) //id of the channel who created it
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

function str2ObjId(str) {
  return _mongoose2.default.Types.ObjectId(str);
}

function sanitize(str, delim) {
  return str.split(delim)[0];
}

function extractImages(story) {
  var mediaKeys = ['media:group', 'media:content', "media:thumbnail"];
  var storyKeys = Object.keys(story);
  var commonKeys = storyKeys.filter(function (key) {
    return mediaKeys.includes(key);
  });
  if (commonKeys.length === 0) {
    return [];
  } else {
    /*console.log(commonKeys[0]);
    console.log(story[commonKeys[0]]);*/
    if (commonKeys[0] === 'media:content') return makeImage(story[commonKeys[0]]).map(function (image) {
      return image.getMongoMedia();
    });else if (commonKeys[0] == 'media:thumbnail') return makeImage(story[commonKeys[0]]).map(function (image) {
      return image.getMongoMedia();
    });else return extractImages(story[commonKeys[0]]);
  }
}

function makeImage(content) {
  //check if it's a single object or an array
  if (!Array.isArray(content)) {
    content = [content];
  }
  var images = content.map(function (image) {
    //must check for a thumbnail
    if (Object.keys(image).includes('media:thumbnail')) {
      var thumbnailJson = image['media:thumbnail'];
      var thumbnail = new Media('image:thumbnail', thumbnailJson.width, thumbnailJson.height, thumbnailJson.url);
      return new Media(image.medium, image.width, image.height, image.url, thumbnail);
    } else {
      if (!Object.keys(image).includes('medium')) {
        //standalone thumbnail
        return new Media('image:thumbnail', image.width, image.height, image.url);
      }
      return new Media(image.medium, image.width, image.height, image.url);
    }
  });
  return images;
}

var Media = function () {
  function Media(medium, w, h, url) {
    var thumbnail = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    _classCallCheck(this, Media);

    this.medium = medium;
    this.width = w;
    this.height = h;
    this.url = url;
    this.thumbnail = thumbnail; //just another media object if supplied
  }

  _createClass(Media, [{
    key: "hasThumbnail",
    value: function hasThumbnail() {
      return !!this.thumbnail;
    }
  }, {
    key: "getThumbnail",
    value: function getThumbnail() {
      return this.thumbnail;
    }
  }, {
    key: "getMongoMedia",
    value: function getMongoMedia() {
      //flatten the media if it has any children (thumbnails etc)
      //let { medium, width, height, url } = this;
      if (this.hasThumbnail()) {
        //we have a thumbnail, flatten
        var flat = [{ medium: this.medium, width: this.width, height: this.height, url: this.url }, { medium: this.thumbnail.medium, width: this.thumbnail.width, height: this.thumbnail.height, url: this.thumbnail.url }];
        return flat;
      } else {
        var _flat = [{ medium: this.medium, width: this.width, height: this.height, url: this.url }];
        return _flat;
      }
    }
  }]);

  return Media;
}();
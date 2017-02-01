"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testStory = testStory;
exports.updateChannel = updateChannel;
exports.updateAll = updateAll;
exports.updateChannels = updateChannels;
exports.update = update;
exports.fetchChannels = fetchChannels;

var _modelGenerators = require("./modelGenerators.js");

var _xml2js = require("xml2js");

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Channel = require("../models/Channel.js");

var _Channel2 = _interopRequireDefault(_Channel);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('es6-promise').polyfill();
require('isomorphic-fetch');


/*
Takes in a url to local json and returns a document id for mlab db
*/
function testStory(url) {
  var obj = JSON.parse(_fs2.default.readFileSync(url, 'utf8'));
  var s = story(obj);
  console.log(s);
}

function updateChannel(id) {
  _mongoose2.default.connect("mongodb://grantcol:weezybaby21@ds137759.mlab.com:37759/polysrc");
  _Channel2.default.findOne({ shortName: id }, function (err, doc) {
    if (!err) {
      //console.log(doc);
      update(doc);
    } else {
      console.log(err);
    }
  });
}

function updateAll() {}

function updateChannels(ids) {
  ids.forEach(function (id) {
    _Channel2.default.findOne({ shortName: id }, function (err, doc) {
      if (!err) {
        console.log(doc);
        update(doc);
      } else {
        console.log(err);
      }
    });
  });
}

function update(channel) {
  var id = channel._id;
  var url = channel.rss;

  fetch(url).then(function (res) {
    return res.text();
  }).then(function (body) {
    (0, _xml2js.parseString)(body, function (err, result) {
      var items = result.rss.channel[0].item;
      console.log(items.length);
      items.forEach(function (item) {
        //console.log(item);
        var story = (0, _modelGenerators.makeStory)(item, id);
        story.save(function (err) {
          if (err) {
            console.log('error', err);
          } else {
            console.log('success');
          }
        });
      });
    });
  }).catch(function (err) {
    console.log(err);
  });
}

function fetchChannels() {
  _mongoose2.default.connect("mongodb://grantcol:weezybaby21@ds137759.mlab.com:37759/polysrc");
  var channels = JSON.parse(_fs2.default.readFileSync("/Users/grantcollins/dev/source/polysourceReact/server/data/channels.json", 'utf8'));
  Object.keys(channels).forEach(function (key) {
    console.log(key, channels[key]);
    fetch(channels[key]).then(function (res) {
      return res.text();
    }).then(function (body) {
      (0, _xml2js.parseString)(body, function (err, result) {
        var c = (0, _modelGenerators.makeChannel)(result.rss.channel[0], channels[key], key);
        console.log(c);
        c.save(function (err) {
          if (!err) {
            console.log('success');
          } else {
            console.log('error saving the doc', err);
          }
        });
      });
      return body;
    }).catch(function (err) {
      return err;
    });
  });
}

updateChannel('cnn');
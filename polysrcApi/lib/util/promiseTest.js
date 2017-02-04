'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _polysrc_config = require('../polysrc_config.js');

var _Story = require('../models/Story.js');

var _Story2 = _interopRequireDefault(_Story);

var _Channel = require('../models/Channel.js');

var _Channel2 = _interopRequireDefault(_Channel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;
_mongoose2.default.connect(_polysrc_config.DB_URI, function (err) {
  if (err) console.log(err);
});

function testPromiseChain() {
  fetchStories().then(function (docs) {
    var saveAll = saveStories(docs);
    console.log('SAVE ALL PROMISE', saveAll);
    saveAll.then(function (result) {
      console.log("RESULT OF SAVING ALL THE MODELS", result.length);
      return result.map(function (r) {
        return r.title;
      });
    }).then(function (names) {
      console.log('article names', names);
    }).catch(function (err) {
      console.log('error saving all!', err);
    });
  });
}

function fetchStories() {
  console.log('fetching the stories!');
  return _Story2.default.find({}).sort({ pubDate: -1 }).limit(5).exec().then(function (docs) {
    return docs;
  });
}

function saveStories(docs) {
  console.log('DOCS HANDED OFF', docs.length);
  var saves = docs.map(function (doc) {
    return doc.save();
  });
  console.log('SAVE PROMISES', saves.length);
  return Promise.all(saves);
}

console.log('begining promise test', _polysrc_config.DB_URI);
testPromiseChain();
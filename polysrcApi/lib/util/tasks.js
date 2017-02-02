'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkFeeds = checkFeeds;
exports.fetchNews = fetchNews;
exports.configureSchedule = configureSchedule;
exports.emitFeedUpdate = emitFeedUpdate;

var _later = require('later');

var _later2 = _interopRequireDefault(_later);

var _localData = require('../data/localData.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('es6-promise').polyfill();
require('isomorphic-fetch');

function checkFeeds() {
  var feeds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var env = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'DEV';
  var update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  switch (env) {
    case 'DEV':
      if (feeds.length <= 0) {
        var channels = _localData.allChannels;
      } else {
        var _channels = Object.keys(_localData.allChannels).map(function (key) {
          //if channel name exists in feeds return allChannels[key]
        });
      }
      //fetch all the data from the channels
      var payload = _localData.updatePayload;
      //emit from socketio and store in mongo here so it can be unsupervised
      if (!!update) {
        update(payload);
      }
    case 'PROD':
      return [];
    default:
      return [];
  }
}

function fetchNews(name, url) {
  console.log('fetching new news from ' + name + ' @ ' + url);
  return fetch(url).then(function (result) {
    return res.text();
  }).then(function (body) {
    console.log(body);
  }).catch(function (err) {
    console.log(err);
  });
}

function configureSchedule() {
  //configure a later object here and return it for server
}

function emitFeedUpdate(socket, payload) {
  socket.emit('feed-update', payload);
}
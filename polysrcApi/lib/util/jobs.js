'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateFeed = updateFeed;
exports.testUpdate = testUpdate;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _polysrc_config = require('../polysrc_config');

var _Story = require('../models/Story');

var _Story2 = _interopRequireDefault(_Story);

var _Channel = require('../models/Channel');

var _Channel2 = _interopRequireDefault(_Channel);

var _tasks = require('./tasks');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//may not be necessary
function updateFeed() {
  var socket = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  _Channel2.default.find({}).exec().then(function (docs) {
    console.log('preparing to fetch from ' + docs.length + ' sources ...');
    var now = Date.now(); //save the current time so we can look up the newly fetched stories
    (0, _tasks.fetchFeeds)(docs).then(function (storyModels) {
      Promise.all(storyModels).then(function (stories) {
        console.log(stories.length + ' STORIES RETURNED');
        //once we've saved all the stories we can update the channel object with a new builddate
        //this actually returns stories for us to send to the client
        if (stories.length > 0) {
          if (socket !== null) {
            socket.emit('feed-update', stories);
          } else {
            console.log('no socket supplied!');
          }
          (0, _tasks.updateBuildDates)();
        }
      });
    }).catch(function (err) {
      console.log('error fetching the feeds!', err);
    });
  }).catch(function (err) {
    console.log('error quering the db!', err);
  });
}

function testUpdate(interval) {
  var socket = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  //if(socket === null) return false;
  return setInterval(function () {
    console.log('checking for new stuff');
    console.log('found some new stuff');
  }, interval);
}

//let d2 = new Date('2017-02-03T23:27:00.000Z')
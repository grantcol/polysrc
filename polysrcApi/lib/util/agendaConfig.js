'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureAgenda = configureAgenda;

var _agenda = require('agenda');

var _agenda2 = _interopRequireDefault(_agenda);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _polysrc_config = require('../polysrc_config');

var _Story = require('../models/Story');

var _Channel = require('../models/Channel');

var _tasks = require('./tasks');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//may not be necessary
function configureAgenda() {
  var socket = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  var agenda = new _agenda2.default({ db: { address: _polysrc_config.DB_URI } });
  console.log('configuring the new agenda', agenda);
  agenda.define('update-feed', function (job, done) {
    _Channel.Channel.find({}).exec().then(function (docs) {
      console.log('preparing to fetch from ' + docs.length + ' sources ...');
      var now = Date.now(); //save the current time so we can look up the newly fetched stories
      (0, _tasks.fetchFeeds)(docs).then(function (storyModels) {
        Promise.all(storyModels).then(function (stories) {
          console.log("STORIES RETURNED", stories.length, stories[0]);
          //once we've saved all the stories we can update the channel object with a new builddate
          //this actually returns stories for us to send to the client
          if (socket !== null) {
            socket.emit('feed-update', stories);
          } else {
            console.log('no socket supplied!');
          }
          return (0, _tasks.updateBuildDates)();
        }).then(function (docs) {
          console.log('successfully updated pubDates job done');
          done();
        }).catch(function (err) {
          console.log('error updating the build dates!', err);
          done();
        });
      }).catch(function (err) {
        console.log('error fetching the feeds!', err);
        done();
      });
    }).catch(function (err) {
      console.log('error quering the db!', err);
      done();
    });
  });
  agenda.now('update-feed');
  return agenda;
  //return agenda;
}
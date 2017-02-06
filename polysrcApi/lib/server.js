"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _http = require("http");

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _xml2js = require("xml2js");

var _xml2js2 = _interopRequireDefault(_xml2js);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Story = require("./models/Story.js");

var _Story2 = _interopRequireDefault(_Story);

var _Channel = require("./models/Channel");

var _Channel2 = _interopRequireDefault(_Channel);

var _localData = require("./data/localData.js");

var _polysrc_config = require("./polysrc_config.js");

var _tasks = require("./util/tasks.js");

var _manager = require("./util/manager.js");

var _manager2 = _interopRequireDefault(_manager);

var _jobs = require("./util/jobs.js");

var jobs = _interopRequireWildcard(_jobs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('es6-promise').polyfill();
require('isomorphic-fetch');

var app = (0, _express2.default)();
var server = (0, _http.Server)(app);
var io = require('socket.io')(server);
var updated = false;
var db = _mongoose2.default.createConnection(_polysrc_config.DB_URI);
var toMill = function toMill(minutes) {
  return minutes * 60 * 1000;
};

console.log(server);
io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('a user disconnected');
  });
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  (0, _request2.default)('http://rss.cnn.com/rss/cnn_topstories.rss', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var parseString = _xml2js2.default.parseString;
      parseString(body, function (err, result) {
        //console.log(result);
        console.log(result.rss.channel[0].item[0]);

        res.send(result.rss.channel[0].item[0]);
      });
    } else {
      res.send('whos mans is thih?');
    }
  });
});

app.get('/stories', function (req, res) {
  if (db) {
    _Story2.default.find({}).sort({ pubDate: -1 }).populate('_creator').limit(25).exec(function (error, docs) {
      if (!error) {
        var stories = (0, _tasks.deDupeUrl)(docs);
        res.status(200).send(stories);
      } else {
        res.status(500).send(error);
      }
    });
  }
});

app.get('/tv', function (req, res) {
  if (db) {
    _Story2.default.find({ type: 'video' }).sort({ pubDate: -1 }).populate('_creator').limit(25).exec(function (error, docs) {
      if (!error) {
        var stories = (0, _tasks.deDupeUrl)(docs);
        res.status(200).send(stories);
      } else {
        res.status(500).send(error);
      }
    });
  }
});

app.get('fm', function (req, res) {
  if (db) {
    _Story2.default.find({ type: 'audio' }).sort({ pubDate: -1 }).populate('_creator').limit(25).exec(function (error, docs) {
      if (!error) {
        var stories = (0, _tasks.deDupeUrl)(docs);
        res.status(200).send(stories);
      } else {
        res.status(500).send(error);
      }
    });
  }
});

app.get('/story/:id', function (req, res) {
  if (db) {
    _Story2.default.findById(req.params.id).populate('_creator').exec(function (error, docs) {
      if (!error) {
        res.status(200).send(docs);
      } else {
        res.status(404).send(error);
      }
    });
  }
});

app.get('/channel/:id', function (req, res) {
  if (db) {
    _Channel2.default.findById(req.params.id, function (error, docs) {
      if (!error) {
        res.status(200).send(docs);
      } else {
        res.status(404).send(error);
      }
    });
  }
});

server.listen(8080, function () {
  console.log('listening on *:8080');
  console.log('hitting on all 6 cylinders');
  var jobId = setInterval(function () {
    console.log('checking for updates');
    jobs.updateFeed(io);
  }, toMill(15));
});
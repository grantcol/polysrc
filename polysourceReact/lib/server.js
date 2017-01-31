"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _xml2js = require("xml2js");

var _xml2js2 = _interopRequireDefault(_xml2js);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Story = require("./models/Story.js");

var _Story2 = _interopRequireDefault(_Story);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('es6-promise').polyfill();
require('isomorphic-fetch');

var app = (0, _express2.default)();

_mongoose2.default.connect("mongodb://grantcol:weezybaby21@ds137759.mlab.com:37759/polysrc");

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
  _Story2.default.find({}, function (error, docs) {
    if (!error) {
      res.status(200).send(docs);
    } else {
      res.status(500).send(error);
    }
  });
});

app.listen(8080);

/*
XML LAYOUT
parsed.rss.channel:
[{
"title":["CNN.com - RSS Channel - Mobile App Manual"],
"description":["CNN.com delivers up-to-the-minute news and information on the latest top stories, weather, entertainment, politics and more."],"link":["http://www.cnn.com/mobile-app-manual/index.html"],
"image":[{"url":["http://i2.cdn.turner.com/cnn/2015/images/09/24/cnn.digital.png"],
"title":["CNN.com - RSS Channel - Mobile App Manual"],
"link":["http://www.cnn.com/mobile-app-manual/index.html"]
}]
*/
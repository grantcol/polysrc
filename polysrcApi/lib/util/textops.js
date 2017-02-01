'use strict';

var _lda = require('lda');

var _lda2 = _interopRequireDefault(_lda);

var _Story = require('../models/Story.js');

var _Story2 = _interopRequireDefault(_Story);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function writeDocuments() {
  _mongoose2.default.connect("mongodb://grantcol:weezybaby21@ds137759.mlab.com:37759/polysrc");
  _Story2.default.find({}, function (err, docs) {
    console.log('found the docs', docs);
    if (!err) {
      var titles = docs.map(function (doc) {
        return doc.title;
      });
      _fs2.default.writeFile(__dirname + "/../data/titles.txt", titles, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      });
    } else {
      console.log('brick');
    }
  });
  return;
}

function getDocuments() {
  var docs = _fs2.default.readFileSync(__dirname + "/../data/titles.txt", 'utf8');
  docs = docs.split(",");
  return docs;
}

function analyzeLDA() {
  var docs = getDocuments();
  var result = (0, _lda2.default)(docs, 3, 5, null, null, null, 123);
  // For each topic.
  for (var i in result) {
    var row = result[i];
    console.log('Topic ' + (parseInt(i) + 1));

    // For each term.
    for (var j in row) {
      var term = row[j];
      console.log(term.term + ' (' + term.probability + '%)');
    }

    console.log('');
  }
}

analyzeLDA();
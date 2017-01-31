'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storySchema = _mongoose2.default.Schema({
  title: String,
  author: String,
  description: String,
  url: String,
  media: [{ medium: String, height: String, width: String, url: String }],
  source: String,
  category: String,
  pubDate: Date,
  guid: { type: String, unique: true },
  _creator: { type: _mongoose2.default.Schema.ObjectId, ref: 'Channel' }
}, {
  timestamps: true
}); // schema.js

module.exports = _mongoose2.default.model('Story', storySchema);
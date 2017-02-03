'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var channelSchema = _mongoose2.default.Schema({
  title: { type: String, unique: true },
  description: String,
  url: String,
  image: String,
  bias: String,
  stories: [{ type: _mongoose2.default.Schema.Types.ObjectId, ref: 'Story', unique: true }],
  rss: String,
  shortName: String,
  lastBuildDate: Date
}, {
  timestamps: true
}); // schema.js

module.exports = _mongoose2.default.model('Channel', channelSchema);

/*
'title',
  'description',
  'link',
  'image',
  'generator',
  'lastBuildDate',
  'pubDate',
  'copyright',
  'language',
  'ttl',
  'atom10:link',
  'feedburner:info',
  'thespringbox:skin',
  'item'
*/
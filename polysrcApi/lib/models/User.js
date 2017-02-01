'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userSchema = _mongoose2.default.Schema({
  name: String,
  username: String,
  description: String,
  url: String,
  image: String
}, {
  timestamps: true
}); // schema.js

module.exports = _mongoose2.default.model('User', userSchema);
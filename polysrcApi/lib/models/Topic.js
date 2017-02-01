'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var topicSchema = _mongoose2.default.Schema({
	title: String,
	stories: [_mongoose2.default.Schema.ObjectId]
}, {
	timestamps: true
}); // schema.js

module.exports = _mongoose2.default.model('Topic', topicSchema);
// schema.js

import mongoose from 'mongoose';


let storySchema = mongoose.Schema({
	title: String,
  author: String,
  description: String,
  url: String,
  media: [{}],
  source: String,
  category: String,
  pubDate: Date,
	_creator : { type: mongoose.Schema.ObjectId, ref: 'Channel' }
},
{
  timestamps: true
});

module.exports = mongoose.model('Story', storySchema);

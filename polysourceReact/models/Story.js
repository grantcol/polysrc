// schema.js

import mongoose from 'mongoose';


var storySchema = mongoose.Schema({
	title: String,
  author: String,
  description: String,
  url: String,
  media: [{medium:String, height:String, width:String, url:String}],
  source: String,
  category: String,
  pubDate: Date,
  guid: {type:String, unique:true}
},
{
  timestamps: true
});

module.exports = mongoose.model('Story', storySchema);

// schema.js

import mongoose from 'mongoose';


let channelSchema = mongoose.Schema({
	title: {type:String, unique:true},
  description: String,
  url: String,
  image: String,
  bias: String,
	stories : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
	rss: String,
	shortName: String,
	lastBuildDate: Date
},
{
  timestamps: true
});

module.exports = mongoose.model('Channel', channelSchema);

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

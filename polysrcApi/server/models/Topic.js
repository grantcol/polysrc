// schema.js

import mongoose from 'mongoose';


let topicSchema = mongoose.Schema({
	title: String,
	stories: [mongoose.Schema.ObjectId]
},
{
  timestamps: true
});

module.exports = mongoose.model('Topic', topicSchema);

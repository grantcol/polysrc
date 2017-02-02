// schema.js

import mongoose from 'mongoose';


let topicSchema = mongoose.Schema({
	title: String
},
{
  timestamps: true
});

module.exports = mongoose.model('Topic', topicSchema);

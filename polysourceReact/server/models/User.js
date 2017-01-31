// schema.js

import mongoose from 'mongoose';


var userSchema = mongoose.Schema({
	name: String,
  username: String,
  description: String,
  url: String,
  image: String
},
{
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

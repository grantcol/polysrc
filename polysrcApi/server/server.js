import express  from "express";
import request  from "request";
import xml2js from "xml2js";
import mongoose from "mongoose";
import agenda from 'agenda';
import Story from './models/Story.js';
import Channel from './models/Channel';
import {updatePayload} from './data/localData.js';
import {DB_URI} from './polysrc_config.js';
require('es6-promise').polyfill();
require('isomorphic-fetch');

let app = express();
let server = app.listen(8080);
let io = require('socket.io').listen(server);
let connection = false;
let updated = false;

mongoose.connect(DB_URI, (err) => { connection = err ? false : true } );
//console.log('connected?', connection);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('feed-update', updatePayload);
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res){
  request('http://rss.cnn.com/rss/cnn_topstories.rss', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let parseString = xml2js.parseString;
      parseString(body, function(err, result){
        //console.log(result);
        console.log(result.rss.channel[0].item[0])

        res.send(result.rss.channel[0].item[0]);
      });
    } else {
      res.send('whos mans is thih?');
    }
  })

});

app.get('/stories', function(req, res){
  if(connection){
    Story.find({}).sort({pubDate: -1}).populate('_creator').limit(25).exec((error, docs) => {
      if(!error){
        res.status(200).send(docs);
      } else {
        res.status(500).send(error);
      }
    });
  }
});

app.get('/story/:id', function(req, res){
    if(connection){
      Story.findById(req.params.id).populate('_creator').exec((error, docs) => {
        if(!error){
          res.status(200).send(docs)
        } else {
          res.status(404).send(error);
        }
      });
    }
})

app.get('/channel/:id', function(req, res){
  if(connection){
    Channel.findById(req.params.id, function(error, docs){
      if(!error){
        res.status(200).send(docs);
      } else {
        res.status(404).send(error);
      }
    });
  }
});

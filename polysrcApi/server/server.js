import express  from "express";
import {Server} from 'http';
import request  from "request";
import xml2js from "xml2js";
import mongoose from "mongoose";
import Story from './models/Story.js';
import Channel from './models/Channel';
import { updatePayload } from './data/localData.js';
import { DB_URI } from './polysrc_config.js';
import { deDupeUrl } from './util/tasks.js';
import Manager from './util/manager.js';
import * as jobs from './util/jobs.js';
import { exec } from 'child_process';

require('es6-promise').polyfill();
require('isomorphic-fetch');

let app = express();
let server = Server(app);
let io = require('socket.io')(server);
let updated = false;
let db = mongoose.createConnection(DB_URI);
const toMill = (minutes) => { return minutes*60*1000; }

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });
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
  if(db){
    Story.find({}).sort({pubDate: -1}).populate('_creator').limit(25).exec((error, docs) => {
      if(!error){
        let stories = deDupeUrl(docs);
        res.status(200).send(stories);
      } else {
        res.status(500).send(error);
      }
    });
  }
});

app.get('/tv', function(req, res){
  if(db){
    Story.find({type:'video'}).sort({pubDate:-1}).populate('_creator').limit(25).exec((error, docs) => {
      if(!error){
        let stories = deDupeUrl(docs);
        res.status(200).send(stories);
      } else {
        res.status(500).send(error);
      }
    });
  }
});

app.get('fm', function(req, res){
  if(db){
    Story.find({type:'audio'}).sort({pubDate:-1}).populate('_creator').limit(25).exec((error, docs) => {
      if(!error){
        let stories = deDupeUrl(docs);
        res.status(200).send(stories);
      } else {
        res.status(500).send(error);
      }
    });
  }
});

app.get('/story/:id', function(req, res){
    if(db){
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
  if(db){
    Channel.findById(req.params.id, function(error, docs){
      if(!error){
        res.status(200).send(docs);
      } else {
        res.status(404).send(error);
      }
    });
  }
});

server.listen(8080, function() {
  console.log('listening on *:8080');
  console.log('hitting on all 6 cylinders');
  let jobId = setInterval(() => {
    console.log('launching update process');
    //exec('node ../scripts/fetchNews.js')
    jobs.updateFeed(io)
  }, toMill(15));
});

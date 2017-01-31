import lda from 'lda';
import Story from '../models/Story.js';
import mongoose from 'mongoose';
import fs from 'fs';

function writeDocuments() {
  mongoose.connect("mongodb://grantcol:weezybaby21@ds137759.mlab.com:37759/polysrc");
  Story.find({}, function(err, docs){
    console.log('found the docs', docs)
    if(!err) {
      let titles = docs.map(function(doc){ return doc.title; });
      fs.writeFile(__dirname + "/../data/titles.txt", titles, function(err) {
          if(err) {
            return console.log(err);
          }
          console.log("The file was saved!");
      });
    } else {
      console.log('brick');
    }
  });
  return;
}

function getDocuments() {
  let docs = fs.readFileSync(__dirname + "/../data/titles.txt", 'utf8');
  docs = docs.split(",");
  return docs;
}

function analyzeLDA() {
  let docs = getDocuments();
  let result = lda(docs, 10, 10, null, null, null, 123);
  // For each topic.
  for (var i in result) {
      var row = result[i];
      console.log('Topic ' + (parseInt(i) + 1));

      // For each term.
      for (var j in row) {
          var term = row[j];
          console.log(term.term + ' (' + term.probability + '%)');
      }

      console.log('');
  }
}

analyzeLDA();

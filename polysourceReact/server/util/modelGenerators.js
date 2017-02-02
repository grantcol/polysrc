import Story from "../models/Story.js";
import Channel from "../models/Channel.js";
//import getImages from "./parse.js";
//import sanitize from "./parse.js";

export function makeStory(raw, source) {
  //console.log(raw);
  //console.log(raw.title[0], raw.author,raw.description, raw.pubDate,raw.guid, raw.link)
  let story = new Story({
    title: raw.title[0],
    author: !raw.author ? 'N/A' : raw.author[0],
    description: raw.description[0],
    url: raw.link[0],
    guid: raw.guid[0]['_'],
    category: 'Politics',
    pubDate: raw.pubDate[0],
    media:getImages(raw),
    _creator: source //id of the channel who created it
  });
  return story;
}

export function makeChannel(raw, rss, name) {
  //console.log('making a new channel', raw.title[0], raw.description[0], raw.link[0]);
  let channel = new Channel({
    title: raw.title[0],
    description: raw.description[0],
    bias:"N/A",
    url: raw.link[0],
    rss: rss,
    shortName:name
  });
  //console.log(channel);
  return channel;
}

function getImages(json) {
  console.log("YOOOO", json['media:group'][0]['media:content'])
  let media = json['media:group'][0]['media:content'];
  if(media.length > 0){
    let content = media.map(function(m){
      return m.$;
    });
    return content;
  } else {
    return [];
  }
}

function sanitize(str, delim){
  return str.split(delim)[0];
}


/*title: String,
author: String,
description: String,
url: String,
image: String,
media: [{id:String, type: String, content: String}], //mrss,
source: String,
category: String,
pubDate: Date,
guid: {type:String, unique:true}*/

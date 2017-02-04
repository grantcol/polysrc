import Story from "../models/Story.js";
import Channel from "../models/Channel.js";
import mongoose from 'mongoose';

export function makeStory(raw, source, sourceName) {
  let story = new Story({
    title: raw.title,
    author: !raw['dc:creator'] ? 'N/A' : raw['dc:creator'],
    description: raw.description,
    url: raw.link,
    category: 'Politics',
    pubDate: raw.pubDate,
    media: extractImages(raw),
    source: sourceName,
    _creator: str2ObjId(source) //id of the channel who created it
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

function str2ObjId(str) {
  return mongoose.Types.ObjectId(str);
}

function sanitize(str, delim){
  return str.split(delim)[0];
}

export function extractImages(story) {
  let mediaKeys = ['media:group', 'media:content', "media:thumbnail"];
  let storyKeys = Object.keys(story);
  let commonKeys = storyKeys.filter((key) => { return mediaKeys.includes(key) });
  if(commonKeys.length === 0) {
    return [];
  } else {
    /*console.log(commonKeys[0]);
    console.log(story[commonKeys[0]]);*/
    if(commonKeys[0] === 'media:content') return makeImage(story[commonKeys[0]]).map((image) => image.getMongoMedia());
    else if(commonKeys[0] == 'media:thumbnail') return makeImage(story[commonKeys[0]]).map((image) => image.getMongoMedia());
    else return extractImages(story[commonKeys[0]]);
  }
}

function makeImage(content) {
  //check if it's a single object or an array
  if(!Array.isArray(content)){
    content = [content];
  }
  let images = content.map((image) => {
    //must check for a thumbnail
    if(Object.keys(image).includes('media:thumbnail')){
      let thumbnailJson = image['media:thumbnail'];
      let thumbnail = new Media('image:thumbnail', thumbnailJson.width, thumbnailJson.height, thumbnailJson.url);
      return new Media(image.medium, image.width, image.height, image.url, thumbnail);
    } else {
      if(!Object.keys(image).includes('medium')){
        //standalone thumbnail
        return  new Media('image:thumbnail', image.width, image.height, image.url);
      }
      return new Media(image.medium, image.width, image.height, image.url);
    }
  });
  return images;
}

class Media {
  constructor(medium, w, h, url, thumbnail = false) {
    this.medium = medium;
    this.width = w;
    this.height = h;
    this.url = url;
    this.thumbnail = thumbnail; //just another media object if supplied
  }

  hasThumbnail() {
    return !!this.thumbnail
  }

  getThumbnail() {
    return this.thumbnail;
  }

  getMongoMedia() {
    //flatten the media if it has any children (thumbnails etc)
    //let { medium, width, height, url } = this;
    if(this.hasThumbnail()) {
      //we have a thumbnail, flatten
      let flat = [{ medium:this.medium, width:this.width, height:this.height, url:this.url },
                  { medium:this.thumbnail.medium, width:this.thumbnail.width, height:this.thumbnail.height, url:this.thumbnail.url }];
      return flat;
    } else {
      let flat = [{ medium:this.medium, width:this.width, height:this.height, url:this.url }];
      return flat;
    }
  }
}

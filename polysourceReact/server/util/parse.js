import xml2js from "xml2js";

export function parse(xml){
  let parseString = xml2js.parseString;
  parseString(xml, function(err, result){
    //console.log(result);
    console.log(result.rss.channel[0].item[0])
  });
}

/*export function getImages(json) {
  let media = json['media:group']['media:content'];
  if(media){
    let content = media.map(function(m){ return m; });
    console.log(content);
    return content;
  } else {
    return []
  }
}

export function sanitize(str, delim){
  return str.split(delim)[0];
}*/

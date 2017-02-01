import xml2js from "xml2js";

export function parse(xml){
  let parseString = xml2js.parseString;
  parseString(xml, function(err, result){
    //console.log(result);
    console.log(result.rss.channel[0].item[0])
  });
}

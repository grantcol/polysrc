import xml2js from "xml2js";

export default function parse(xml){
  let parseString = xml2js.parseString;
  let result = parseString(xml, function(err, result){ return result });
  console.log(result);
  console.log(Object.keys(result.rss.channel[0].item[0]))
}

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;

var _xml2js = require("xml2js");

var _xml2js2 = _interopRequireDefault(_xml2js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(xml) {
  var parseString = _xml2js2.default.parseString;
  parseString(xml, function (err, result) {
    //console.log(result);
    console.log(result.rss.channel[0].item[0]);
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
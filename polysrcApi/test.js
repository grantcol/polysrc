var moment = require('moment');
var articleDate = moment('2017-02-04T03:10:12.000Z', "YYYY-MM-DD HH:mm Z");
var lastBuildDate = moment("2017-02-03T01:32:27.000Z", "YYYY-MM-DD HH:mm Z");
console.log('article publish date')
console.log(articleDate.format("dddd, MMMM Do YYYY, h:mm:ss a"))
console.log('channel last build date')
console.log(lastBuildDate.format("dddd, MMMM Do YYYY, h:mm:ss a"));

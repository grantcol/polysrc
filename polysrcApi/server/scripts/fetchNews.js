import { fetchFeeds } '../util/tasks.js'
let arg = process.argv[2];
console.log('fetching feeds!');
fetchFeeds(arg);

var https = require('https');
 
/**
 * HOW TO Make an HTTP Call - GET
 */
// options for GET
var optionsget = {
    host : 'graph.facebook.com', // here only the domain name
    // (no http/https !)
    port : 443,
    path : '/v2.6/1412452605496769?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=EAACJrl8N3tEBAEOalynAsFZASukskMQrrFh3LLPvYXut4AE8Is3WIoz72VGHqZCtQZAKW2ZAuHGw2qwTLMqFliGA0gH76cU5aQZB0Db0gCNFf5nwrZA1zeZAOQtCcnuZCdCIozvmdRUtSSZArOGC2zzr0LnXBbKTMZBwzYJUUOTQPUwAZDZD', // the rest of the url with parameters if needed
    method : 'GET' // do GET
};
 
console.info('Options prepared:');
console.info(optionsget);
console.info('Do the GET call');
 
// do the GET request
var reqGet = https.request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);
 
 
    res.on('data', function(d) {
        console.info('GET result:\n');
        process.stdout.write(d);
        console.info('\n\nCall completed');
    });
 
});
 
reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});
 
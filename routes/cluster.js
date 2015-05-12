var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
		host: 'http://409aa8c268b09edef35f450e9b7505b6-us-east-1.foundcluster.com:9200',
		log: 'trace'
});

client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: Infinity,

  // undocumented params are appended to the query string
  hello: "elasticsearch!"
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});


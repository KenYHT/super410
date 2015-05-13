var fs = require('fs');
var async = require('async');
var request = require('request');
var elasticsearch = require('elasticsearch');
var clusterUrl = "http://409aa8c268b09edef35f450e9b7505b6-us-east-1.foundcluster.com:9200";
var client = new elasticsearch.Client({
		host: clusterUrl,
		log: 'trace'
});

var clusterRequests = [];

var graphJSON = { "nodes": [], "links": [] };

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

exports.query = function(req, res) {
  graphJSON = { "nodes": [], "links": [] };
  clusterRequests = [];
	var query = req.body;

  client.search(query)
			.then(function(body) {
				var results = body.hits.hits;
	 			for (var i = 0; i < results.length; i++) {
          results[i]["fromQuery"] = true;
	 				graphJSON["nodes"].push(results[i]);
	 				var currResultIndex = graphJSON["nodes"].length;
	 				// construct incoming edges and nodes
	 				if (results[i]._source.cite_in.length > 0) {
	 					bulkCitations(results[i]._source.cite_in, "incoming", currResultIndex);
	 				}
	 				// construct outgoing edges and nodes
	 				if (results[i]._source.cite_out.length > 0) {
	 					bulkCitations(results[i]._source.cite_out, "outgoing", currResultIndex);
	 				}
	 			}

        async.parallel(clusterRequests, function(err, results) {
          if (err) {
            res.status(500).json({ message: "Error.", data: err });
          } else {
            res.status(200).json({ message: "OK.", data: graphJSON });
          }
        });
	 		});
}

function bulkCitations(citations, direction, currResultIndex) {
		var bulkUrl = clusterUrl + '/phys/doc/_mget';
		var query = { "ids": citations };
		var options = {
			method: 'post',
			body: query,
			json: true,
			url: bulkUrl
		};

    clusterRequests.push(function(cb) {
      request(options, function(err, res, body) {
        constructEdges(body.docs, direction, currResultIndex);
        cb();
      });
    });
}

function constructEdges(bulkResults, direction, currResultIndex) {
	for (var i = 0; i < bulkResults.length; i++) {
    bulkResults[i]["fromQuery"] = false;
		graphJSON["nodes"].push(bulkResults[i]);

		var link = {};

		if (direction === "incoming") {
			link["source"] = graphJSON["nodes"].length;
			link["target"] = currResultIndex;
		} else {
			link["source"] = currResultIndex;
			link["target"] = graphJSON["nodes"].length;
		}

		graphJSON["links"].push(link);
	}
}
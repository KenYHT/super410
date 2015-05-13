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
	var query = req.body.query;
	client.search(query)
			.then(function(body) {
				var results = body.hits.hits;
	 			for (var i = 0; i < results.length; i++) {
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
          for (var i = 0; i < graphJSON.nodes.length; i++) {
            for (var j = i; i < graphJSON.nodes.length; j++) {
              var addEdge = Math.random() < 0.2;
              if (addEdge) {
                var incoming = Math.random() < 0.5;
                var link = {};
                if (incoming) {
                  link["source"] = i.toString();
                  link["target"] = j.toString();
                } else {
                  link["source"] = j.toString();
                  link["target"] = i.toString();
                }

                graphJSON.links.push(link);
              }
            }
          }

          if (err) {
            res.status(500).json({ message: "Error.", data: err });
          } else {
            res.status(200).json({ message: "OK.", data: graphJSON });
          }
        });

	 			// write to json file
	 			// setTimeout(function() {
	 			// 	fs.writeFile('./public/query.json', JSON.stringify(graphJSON, null, 4), function(error) {
	 			// 		if (error) {
	 			// 			res.status(500).json({ message: "Error.", data: error });
	 			// 		} else {
     //          console.log("wrote to file")
	 			// 			res.status(200).json({ message: "OK.", data: {} });
	 			// 		}
	 			// 	})
	 			// }, 1);
	 		});
	 			
}

// exports.saveJSON = function(req, res) {
// 	fs.writeFile('./public/query.json', JSON.stringify(req.body, null, 4), 
// 			function(err) {
// 				if (err) {
// 					res.status(500).json({ message: "Error.", data: error });
// 				} else {
// 					console.log("wrote to JSON file");
// 					res.status(200).json({ message: "OK.", data: {} });
// 				}
// 			});
// }

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
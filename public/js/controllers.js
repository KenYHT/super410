var papertrail = angular.module('papertrail', ['ngRoute']);
var clusterUrl = "http://409aa8c268b09edef35f450e9b7505b6-us-east-1.foundcluster.com:9200";
// var graphJSON = { "nodes": [], "links": [] };

papertrail.controller('SearchController', ['$scope', '$http', '$location', function($scope, $http, $location) {

	$scope.searchForm = {
		query: "",
		classifier: "body_bm25",
		limit: 50
	};

	$scope.showFullForm = false;
	$scope.formToggleLink = "more options";

	$scope.toggleForm = function() {
		if ($scope.showFullForm === false) {
			$scope.formToggleLink = "collapse";
		} else {
			$scope.formToggleLink = "more options"
		}

		$scope.showFullForm = !$scope.showFullForm;
	};

	// also constructs the graph
	$scope.query = function() {
		// make api call to query and get the results
		var queryObject = constructQuery($scope.searchForm);
		$http.post('/api/query', queryObject)
		 		.success(function(res) {
          graph = extractGraph(res.data)
          drawGraph(graph);
		 		})
		 		.error(function(err) {
		 			console.log(err);
		 		});
	};

  function extractGraph(data) {
    var rawNodes = data.nodes;
    var rawLinks = data.links;

    var nodes = extractNodes(rawNodes);
    var links = extractLinks(rawLinks, nodes);
    return {
      "nodes": nodes,
      "links": links
    }
  }

  function extractLinks(rawLinks, nodes) {
    rawLinks.forEach(function (entry) {
      entry.weight = 1;
    });

    rawLinks = rawLinks.filter(function (entry) {
      return (entry && entry.target && entry.target < nodes.length && entry.source && entry.source < nodes.length);
    });

    return rawLinks;
  }

  function extractNodes(rawNodes) {
    var cleaned = [];
    rawNodes.forEach(function (entry) {
      var tmp = entry._source;
      tmp.id = entry._id;
      tmp.weight = 1;
      cleaned.push(tmp);
    })
    return cleaned;
  }

	function constructQuery(queryForm) {
        //guessing queryForm is the query they want
        //and we make a object in the format for the
        //btw this only does bm25 queries
        var constructedQuery = {
            "query" : {
                "match" : {
                    //queryForm.classifier: queryForm.query
                    "body_bm25": queryForm.query
                }
            }
        };
        return constructedQuery
	}
}]);

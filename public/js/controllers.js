var papertrail = angular.module('papertrail', ['ngRoute']);

papertrail.controller('SearchController', ['$scope', '$http', '$location', function($scope, $http, $location) {
	$scope.searchForm = {
		query: "",
		classifier: "body_bm25",
		limit: 10
	};

	$scope.query = function() {
		// make api call to query and get the results
		console.log("query() has been called");
		console.log("The form is", $scope.searchForm);
		// var queryObject = constructQuery($scope.searchForm);
		// $http.post('/api/query', queryObject)
		// 		.success(function(res) {
		// 			console.log(res);
		// 		})
		// 		.error(function(err) {
		// 			console.log(err);
		// 		});
	};

	function constructQuery(queryForm) {

	}
}]);
var papertrail = angular.module('papertrail', ['ngRoute']);

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
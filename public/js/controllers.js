var papertrail = angular.module('papertrail', ['ngRoute']);

papertrail.controller('SearchController', ['$scope', '$http', '$location', function($scope, $http, $location) {
	$scope.searchForm = {
		query: "",
		classifier: "",
		limit: 10
	};

	$scope.query = function() {
		// make api call to query and get the results
		var queryObject = constructQuery($scope.searchForm);
		$http.post('/api/query', queryObject)
				.success(function(res) {

				})
				.error(function(err) {

				});
	};

	function constructQuery(queryForm) {

	}
}]);
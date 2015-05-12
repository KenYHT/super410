papertrail.config(function($routeProvider){
  $routeProvider
  .when('/graph', {
    templateUrl: './partials/_graph.html',
    controller: 'SearchController'
  })
});
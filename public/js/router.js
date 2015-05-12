papertrail.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: './partials/_graph.html',
    controller: 'SearchController'
  })
});
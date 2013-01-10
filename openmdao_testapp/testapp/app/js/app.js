'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/commits.html', controller: CommitsCtrl});
    $routeProvider.when('/commits', {templateUrl: 'partials/commits.html', controller: CommitsCtrl});
    $routeProvider.when('/commit/:commit_id', {templateUrl: 'partials/commit.html', controller: CommitCtrl});
    $routeProvider.otherwise({redirectTo: '/commits'});
  }]);


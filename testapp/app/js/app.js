'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/commits.html', controller: TestsCtrl});
    $routeProvider.when('/commits', {templateUrl: 'partials/commits.html', controller: TestsCtrl});
    $routeProvider.when('/hosts', {templateUrl: 'partials/hosts.html', controller: HostsCtrl});
    $routeProvider.otherwise({redirectTo: '/hosts'});
  }]);

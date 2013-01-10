'use strict';

/* Controllers */


function CommitsCtrl($scope, $http) {
    $http.get('/commits').
        success(function(data, status, headers, config) {
            $scope.commit_tests = data;
        }).
        error(function(data, status, headers, config) {
            console.log("ERROR while getting /commits");
        });

    /*
        Returns the proper class to bootstrap based on the number of failed or
        skipped tests.
    */
    $scope.outcome = function(test) {
        if (test.fails > 0) {
            return "error";
        }
        return "success";
    };
}
CommitsCtrl.$inject = ['$scope', '$http'];


function CommitCtrl($scope, $http, $routeParams) {
    console.log('getting hosts');
    $http.get('/hosts/'+$routeParams.commit_id).
        success(function(data, status, headers, config) {
            $scope.host_tests = data;
        }).
        error(function(data, status, headers, config) {
            console.log("ERROR while getting /commit/"+$routeParams.commit_id);
        });

    $scope.outcome = function(test) {
        if (test.fails > 0) {
            return "error";
        }
        else if (test.skips > 0) {
            return "warning";
        }
        return "success";
    };
}
CommitCtrl.$inject = ['$scope', '$http', '$routeParams'];

'use strict';

/* Controllers */


function CommitsCtrl($scope, $http) {
    $http.get('/tests').
        success(function(data, status, headers, config) {
            $scope.commit_tests = data;
        }).
        error(function(data, status, headers, config) {
            console.log("ERROR while getting /tests");
        });

    /*
        Returns the proper class to bootstrap based on the number of failed or
        skipped tests.
    */
    $scope.outcome = function(test) {
        if (test.fails > 0 || test.passes == 0) {
            return "error";
        }
        return "success";
    };
}
CommitsCtrl.$inject = ['$scope', '$http'];


function CommitCtrl($scope, $http, $routeParams) {
    $http.get('/hosts/'+$routeParams.commit_id).
        success(function(data, status, headers, config) {
            $scope.host_tests = data;
        }).
        error(function(data, status, headers, config) {
            console.log("ERROR while getting /hosts/"+$routeParams.commit_id);
        });

    $scope.outcome = function(test) {
        if (test.fails > 0 || test.passes == 0) {
            return "error";
        }
        else if (test.skips > 0) {
            return "warning";
        }
        return "success";
    };
}
CommitCtrl.$inject = ['$scope', '$http', '$routeParams', '$location'];


function TestCtrl($scope, $http, $routeParams) {
    $http.get('/results/'+$routeParams.host+'/'+$routeParams.commit_id).
        success(function(data, status, headers, config) {
            $scope.test = data;
        }).
        error(function(data, status, headers, config) {
            console.log("ERROR while getting '/test/'"+$routeParams.host+"/"+$routeParams.commit_id);
        });

}
TestCtrl.$inject = ['$scope', '$http', '$routeParams'];



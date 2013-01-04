'use strict';

/* Controllers */


function TestsCtrl($scope) {
    $scope.commit_tests = [
        {"commit": "werpoiweufasdf", "passed": 2, "failed": 2, "date": "Jan 1, 2013" },
        {"commit": "gdgsdgsdrgsdrg", "passed": 2, "failed": 2, "date": "Jan 1, 2013" },
        {"commit": "werpoiwecccccc", "passed": 3, "failed": 1, "date": "Jan 1, 2013" },
        {"commit": "werpxxxxxxxsdf", "passed": 3, "failed": 1, "date": "Jan 1, 2013" },
        {"commit": "werpoigggggggf", "passed": 4, "failed": 0, "date": "Jan 1, 2013" }
    ];

    /*
        Returns the proper class to bootstrap based on the number of failed or
        skipped tests.
    */
    $scope.outcome = function(test) {
        if (test.failed > 0) {
            return "error";
        }
        return "success";
    };
}
TestsCtrl.$inject = ['$scope'];


function HostsCtrl($scope) {
    $scope.host_tests = [
        {"host": "ocelot32_py27",   "passed": 859, "failed": 4, "skipped": 0, "elapsed": 2763.6 },
        {"host": "pangolin64_py27", "passed": 863, "failed": 0, "skipped": 0, "elapsed": 2722.1  },
        {"host": "win2008_32_py27", "passed": 859, "failed": 0, "skipped": 2, "elapsed": 2663.3  },
        {"host": "win2008_32_py26", "passed": 859, "failed": 2, "skipped": 2, "elapsed": 2743.9  }
    ];

    $scope.outcome = function(test) {
        if (test.failed > 0) {
            return "error";
        }
        else if (test.skipped > 0) {
            return "warning";
        }
        return "success";
    };
}
HostsCtrl.$inject = ['$scope'];

'use strict';

angular.module('nodeWsTestApp')
  .controller('MainCtrl', function ($scope) {

    $scope.host = location.origin.replace(/^http/, 'ws');
    $scope.ws = new WebSocket($scope.host);

    $scope.tweets = [];
    $scope.empty = true;

    $scope.ws.onmessage = function (event) {
        var twitObj = JSON.parse(event.data);
        //console.log(twitObj);

        $scope.tweets.unshift(twitObj);
        $scope.empty = false;
        $scope.$apply();
    }

    $scope.input = "search twitter live stream...";

    $scope.submit = function() {
      $scope.ws.send($scope.input);
      $scope.input = "search twitter live stream...";
    };
  }).directive('focusInput', function () {
      // Linker function
      return function (scope, element, attrs) {
        element.bind('click', function () {
          scope.input = "";
        });

        element.bind('blur', function() {
          scope.input = "search twitter live stream...";
        });
      };
  });

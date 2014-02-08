'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).directive('myLiebiao', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/classicIndex.html'
    };
}).directive('myWenzhang', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/classicArticle.html'
    };
}).directive('myStart', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/start.html'
    };
}).directive('myMusic', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/music.html'
    };
}).directive('myVideo', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/video.html'
    };
}).directive('myZero', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/zero.html'
    };
}).directive('myEvents', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/events.html'
    };
})


'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngRoute',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers',
    'ngSanitize'
]).
config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        // $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});  
        console.log(window.location.pathname);

        // $routeProvider.when('/start', {
        //     templateUrl: 'partials/start.html',
        //     controller: 'MyCtrl1'
        // });
        // $routeProvider.when('/events', {
        //     templateUrl: 'get.html',
        //     controller: 'MyCtrl1'
        // });

        // $routeProvider.when('/forward', {
        //     templateUrl: 'get.html',
        //     controller: 'MyCtrl1'
        // });
        // $routeProvider.when('/music', {
        //     templateUrl: 'get.html',
        //     controller: 'MyCtrl1'
        // });
        // $routeProvider.when('/video', {
        //     templateUrl: 'get.html',
        //     controller: 'MyCtrl1'
        // });
        // $routeProvider.when('/zero', {
        //     templateUrl: 'get.html',
        //     controller: 'MyCtrl1'
        // });



        $routeProvider.when('/node/:blogid', {
            templateUrl: 'index.html',
            controller: 'MyCtrl1'
        });

        // $routeProvider.otherwise({
        //     redirectTo: '/start'
        // });

        $locationProvider.html5Mode(true)
    }
]).
filter('htmlToPlaintext', function() {
    return function(text) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = text;
        return tmp.textContent || tmp.innerText || "";
        //     return String(text).replace(/<(?:.|\n)*?>/gm, '');
    }
});



function BlogCtr($scope, $http, $sce, $log, $location) {
    $scope.start = 0;
    $scope.pagesize = 15;
    //有两种api 一个是list 一个是单个的
    $http.get('/data/bloglist?start=' + $scope.start + '&limit=500').success(function(data) {
        for (var d in data) {
            data[d].hash = data[d].url.split('/').pop().split('.').shift()
            data[d].title = data[d].title.trim()
        }

        $scope.blogs = data;
        startRequest(data[0].hash)
    });
    var startRequest = function(blogid) {
        $http.get('/data/blogcontent?blogid=' + blogid).success(function(datas) {
            var replacedurl = datas[0].content.replace(/src=[^<]*real_src[^<]*690"/g, function(word) {

                var jpg = word.split("/").pop().split('&')[0];
                jpg = "src =\"/img/pic/" + jpg + ".jpg\""

                return jpg;
            })
            // console.log(replacedurl);
            //这里遇到的问题是 正则匹配之后只有一个地方被替换
            datas[0].content = $sce.trustAsHtml(replacedurl); //需要去掉多余信息  <div class="articalInfo"> 分割
            $scope.wen = datas[0]

        });
    }

    $scope.Math = window.Math;
    $scope.pageStart = 0;
    // $scope.category = "";
    $scope.clickBlog = function(hash) {

        $scope.currenthash = hash;
        startRequest(hash);
    }
    $scope.clickPage = function(page) {
        $scope.pageStart = page * $scope.pagesize;
    }

   
}
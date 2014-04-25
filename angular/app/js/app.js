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

        //这里可以添加关键字

        var keywordsMap = {
            '重点推荐': ['http://blog.sina.com.cn/s/blog_5f13c9960101fp72.html', 'http://blog.sina.com.cn/s/blog_5f13c9960101dfgk.html', 'http://blog.sina.com.cn/s/blog_5f13c99601015ofu.html', 'http://blog.sina.com.cn/s/blog_5f13c99601016hcq.html', 'http://blog.sina.com.cn/s/blog_5f13c9960101acr7.html', 'http://blog.sina.com.cn/s/blog_5f13c9960101bkhc.html', 'http://blog.sina.com.cn/s/blog_5f13c9960101bm7t.html', 'http://blog.sina.com.cn/s/blog_5f13c99601018otw.html', 'http://blog.sina.com.cn/s/blog_5f13c99601015p38.html', 'http://blog.sina.com.cn/s/blog_5f13c99601015qrr.html', 'http://blog.sina.com.cn/s/blog_5f13c996010141uw.html', 'http://blog.sina.com.cn/s/blog_5f13c99601013227.html', 'http://blog.sina.com.cn/s/blog_5f13c99601012w9y.html'],
        };

        //这里可以将文章置顶
        var zhiding = ['http://blog.sina.com.cn/s/blog_5f13c9960101ie4q1.html','http://blog.sina.com.cn/s/blog_5f13c9960101ibrv1.html','http://blog.sina.com.cn/s/blog_5f13c9960101ibrv2.html','http://blog.sina.com.cn/s/blog_5f13c9960101fp72.html', 'http://blog.sina.com.cn/s/blog_5f13c9960101afzp.html','http://blog.sina.com.cn/s/blog_5f13c99601012aa8.html', 'http://blog.sina.com.cn/s/blog_5f13c99601010v3v.html','http://blog.sina.com.cn/s/blog_5f13c9960101dfgk.html', 'http://blog.sina.com.cn/s/blog_5f13c99601015ofu.html', 'http://blog.sina.com.cn/s/blog_5f13c99601016hcq.html', 'http://blog.sina.com.cn/s/blog_5f13c9960101acr7.html', 'http://blog.sina.com.cn/s/blog_5f13c9960101bkhc.html', 'http://blog.sina.com.cn/s/blog_5f13c9960101bm7t.html', 'http://blog.sina.com.cn/s/blog_5f13c99601018otw.html', 'http://blog.sina.com.cn/s/blog_5f13c99601015p38.html', 'http://blog.sina.com.cn/s/blog_5f13c99601015qrr.html', 'http://blog.sina.com.cn/s/blog_5f13c996010141uw.html', 'http://blog.sina.com.cn/s/blog_5f13c99601013227.html', 'http://blog.sina.com.cn/s/blog_5f13c9960100xv67.html','http://blog.sina.com.cn/s/blog_5f13c99601012w9y.html'];

        var tmpdata = [];
        var tmpdata1 = [];
        var tmpdata2 = [];
        for (var d in data) {
            data[d].hash = data[d].url.split('/').pop().split('.').shift()
            data[d].title = data[d].title.trim()
            data[d].blogtime = parseInt(d);
            for (var d1 in keywordsMap) {
                for (var d2 in keywordsMap[d1]) {
                    if (data[d].url == keywordsMap[d1][d2]) {
                        data[d].blog_class = d1;
                        data[d].blogtime = 0;
                    }
                }
            }

            tmpdata.push(data[d]);
            if (zhiding.indexOf(data[d].url) > -1) {
                tmpdata.pop()
                tmpdata1.push(data[d])
            }

        }

        //按照置顶的顺序显示，加亮
        for (var d in zhiding) {
            for (var d1 in tmpdata1) {
                if (tmpdata1[d1].url == zhiding[d]) {
                    tmpdata1[d1].title="<span style='color:red'>【置顶】</span>"+tmpdata1[d1].title;
                    tmpdata1[d1].title=$sce.trustAsHtml(tmpdata1[d1].title);
                    tmpdata2.push(tmpdata1[d1])
                }
            }

        }

        data = tmpdata2.concat(tmpdata);



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

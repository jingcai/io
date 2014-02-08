'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('MyCtrl2', [

]).controller('MyCtrl1', ['$scope', '$routeParams', '$location',
    function($scope, $routeParams, $location) {
        $scope.$routeParams = $routeParams;
        $scope.$location = $location;
        if ($routeParams.blogid) {
            $scope.xuanzhe = "wenzhang"
            $scope.cssurl = "./moban_files/article.12092.css"
        } else {
            $scope.xuanzhe = "liebiao"
            $scope.cssurl = "./moban_files/home.12312.css"
        };
        // $scope.path = $location.path().split('/')[1]; //路由关键点，没必要纠结                   
        console.log($location.search());
        $scope.path = $location.search().section
        $scope.headerJson = [
            ['start', '原创文章', "禹晖永远不会出版任何书籍或自传，因为”人者见人，觉者见觉，迷者见迷……”，禹晖博客空间是个灵性知识”数据大超市” ，随性自取……禹晖的课程只是”人以类聚”的集体共振，生命数据升华与超越的物理实相见证过程……"],
            // ['forward', "他山之石", "银河联邦的各种通灵信息比较复杂繁多，禹晖所转发的相关银河联邦信息 基本是经过大宇宙中心过滤识别后再发出，因为这些信息是源头自己发送出去的。"],
            ['music', '全觉新人类声频', "禹晖只能告诉你:地球通往无限自由的生命网格服务器（禹晖心舞888网格）已经开通并可以登陆体验了，不能保证你放弃这里登陆旧地球144网格服务器或者其他星球网格服务器……你的生命你做主！！登陆禹晖心舞888网格的密码是“能使你成为圆觉新人类的十首歌曲的歌词”...... <br><br><a target='_blank' href='http://y.baidu.com/jingcai' class='btn btn-outline-inverse btn-lg'>歌曲下载</a>"],
            // ['video', '晶彩视频', "开启"],
            // ['zero', '0的法则', '<div id="sina_keyword_ad_area2" class="articalContent ">    <p align="center"><font style="FonT-siZe: 56px" color="#ED1C24"><strong>2012年08月08日</strong></font></p><p align="center"><strong><font style="FonT-siZe: 32px" color="#00B7EF">睡眠中忽然被一个声音唤醒：</font></strong></p><p align="center"><strong><font style="FonT-siZe: 32px" color="#00B7EF">“你在执行【<font color="#FB3287">0的法则</font><font color="#00B7EF">】</font>，他们执行【<font color="#712CFC">1的法则</font><font color="#00B7EF">】</font>，这就是你与他们的不同！！”</font></strong></p><p align="center">&nbsp;<wbr></p><p align="center"><strong><font color="#00B7EF" size="6">听到此言我立刻醒来拿起手机看到时间是：</font></strong></p><p align="center"><strong><font style="FonT-siZe: 56px" color="#ED1C24" size="6">01:01</font></strong></p><p align="center"><strong><font style="FonT-siZe: 22px" color="#22B14C">于是继续向这个声音提问：</font></strong></p><p align="center"><strong><font style="FonT-siZe: 22px" color="#22B14C">请问《<font color="#FB3287">0的法则</font>》具体内容是什么？</font></strong></p><p align="center"><strong><font style="FonT-siZe: 24px" color="#22B14C">答复</font></strong><strong><font color="#22B14C" size="5">共<font style="FonT-siZe: 56px">23</font>条：</font></strong></p><p align="center"><strong><font color="#FF7E00" size="5">1.无始无终;2.生命永恒; 3.内外无敌；4.出入圆通；</font></strong></p><p align="center"><font color="#FF7E00"><strong><font size="5">5.内在平衡；6.阴阳自转；7.不入因果；</font></strong><strong><font size="5">8.不障时空；</font></strong></font></p><p align="center"><strong><font color="#FF7E00" size="5">9.境随心转；10.光明无限；11.佛道自性；12.创造本心；</font></strong></p><p align="center"><strong><font color="#FF7E00" size="5">13.空有自如；14.我即一切；15.当下即是；16.和谐本元；</font></strong></p><p align="center"><strong><font color="#FF7E00" size="5">17.声光自显；18.无师自通；19.天地兼容；20.宙宇恒通；21.万物自生；</font></strong><strong><font color="#FF7E00" size="5">22.其乐无穷；<font color="#00B7EF">23</font>.妙法自出。</font></strong></p><p align="center">&nbsp;<wbr></p><p align="center"><strong><font color="#22B14C" size="5">这23条“0的法则”是新银河系地球的天堂规律，</font></strong></p></div>'],
            ['events', '公告', '']
        ];
        var pathheader = function() {
            for (var i in $scope.headerJson) {
                if ($scope.headerJson[i][0] == $scope.path) {
                    $scope.currentHeader = $scope.headerJson[i]
                };
            }
        }
        pathheader();
        $scope.pathchanged = function(p) {
            $scope.path = p;
            pathheader();
        }
    }
])
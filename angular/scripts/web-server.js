#!/usr/bin/env node

var util = require('util'),
    http = require('http'),
    fs = require('fs'),
    url = require('url'),
    events = require('events');


//数据库初始化
var r = require('rethinkdb');
var connection = null;
r.connect({
    host: 'localhost',
    port: 28015,
    db: 'dong'
}, function(err, conn) {
    if (err) throw err;
    connection = conn;
    console.log("数据库加载成功");
    // r.table("sinablog").orderBy(r.desc("blogtime")).limit(1).run(conn,function(err, cursor) {
    //     cursor.toArray(function(err, result) {
    //        console.log(result[0].blogtime);
    //        })
    // });
});


var DEFAULT_PORT = 80;

function main(argv) {
    new HttpServer({
        'GET': createServlet(StaticServlet),
        'HEAD': createServlet(StaticServlet)
    }).start(Number(argv[2]) || DEFAULT_PORT);
}

function escapeHtml(value) {
    return value.toString().
    replace('<', '&lt;').
    replace('>', '&gt;').
    replace('"', '&quot;');
}

function createServlet(Class) {
    var servlet = new Class();
    return servlet.handleRequest.bind(servlet);
}

/**
 * An Http server implementation that uses a map of methods to decide
 * action routing.
 *
 * @param {Object} Map of method => Handler function
 */

function HttpServer(handlers) {
    this.handlers = handlers;
    this.server = http.createServer(this.handleRequest_.bind(this));
}

HttpServer.prototype.start = function(port) {
    this.port = port;
    this.server.listen(port);
    util.puts('Http Server running at http://localhost:' + port + '/');

};

HttpServer.prototype.parseUrl_ = function(urlString) {
    var parsed = url.parse(urlString);
    parsed.pathname = url.resolve('/', parsed.pathname);
    return url.parse(url.format(parsed), true);
};

HttpServer.prototype.handleRequest_ = function(req, res) {
    var logEntry = req.method + ' ' + req.url;
    if (req.headers['user-agent']) {
        logEntry += ' ' + req.headers['user-agent'];
    }
    util.puts(logEntry);
    req.url = this.parseUrl_(req.url);
    var handler = this.handlers[req.method];
    if (!handler) {
        res.writeHead(501);
        res.end();
    } else {
        handler.call(this, req, res);
    }
};

/**
 * Handles static content.
 */

function StaticServlet() {}

StaticServlet.MimeMap = {
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'xml': 'application/xml',
    'json': 'application/json',
    'js': 'application/javascript',
    'map': 'application/javascript',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'png': 'image/png',
     'svg': 'image/svg+xml',
     'woff': 'application/x-font-woff',
    'pdf': 'application/octet-stream',
    'zip': 'application/octet-stream'
};

StaticServlet.prototype.handleRequest = function(req, res) {
    var self = this;
    // if (req.headers['user-agent']&&req.url.indexOf("get.html") > 0) {
    //     if (req.headers['user-agent'].indexOf('MSIE 8.0') >= 0 || req.headers['user-agent'].indexOf('MSIE 7.0') >= 0 || req.headers['user-agent'].indexOf('MSIE 6.0') >= 0) {
    //         var redirectUrl = url.format(url.parse(url.format(req.url)));            
    //         return self.sendRedirect_(req, res, 'http://888000.org');
    //     }
    // }

    // util.puts(JSON.stringify(req.url.query));
    // 自定义url路由
    //数据请求

    //其他网站分发
    if (req.headers.host&&!(req.headers.host.split('localhost').length == 2||req.headers.host.split('888000.org').length == 2 || req.headers.host.split('jingcai.io').length == 2 || req.headers.host.split('wuzhizhenjing.com').length == 2)) {
        
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        console.log('还在开发');
        res.write("Hello World!");
        res.end();

    } else if (req.url.pathname.indexOf("/data") == 0) {
        //博客数据
        if (req.url.pathname.indexOf("/data/bloglist") == 0) {
            if (req.url.query.start) {

                r.table("sinablog").orderBy(r.desc('blogtime')).skip(parseInt(req.url.query.start)).limit(req.url.query.limit ? parseInt(req.url.query.limit) : 10).without('content').run(connection, function(err, cursor) {
                    if (err) throw err;
                    cursor.toArray(function(err, result) {
                        if (err) throw err;
                        // util.puts(JSON.stringify(result[0]['blog'], null, 2));
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        });
                        res.write(JSON.stringify(result, null, 2))
                        res.end();
                        console.log('数据查询成功');
                        // util.puts('数据查询成功' );
                    });
                });
            }
        };


        if (req.url.pathname.indexOf("/data/blogcontent") == 0 && req.url.query.blogid && req.url.query.blogid.length > 0) {

            r.table("sinablog").filter({
                url: "http://blog.sina.com.cn/s/" + req.url.query.blogid + ".html"
            }).run(connection, function(err, cursor) {
                if (err) throw err;
                cursor.toArray(function(err, result) {
                    if (err) throw err;
                    // util.puts(JSON.stringify(result[0]['blog'], null, 2));
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.write(JSON.stringify(result, null, 2))
                    res.end();
                    console.log('数据查询成功');
                });
            });
        }

        /*执行git update 命令*/
    } else if (req.url.pathname.indexOf("/update") == 0) {
        var exec = require('child_process').exec,
            last = exec('pushd .. && git pull  && popd');

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        last.stdout.on('data', function(data) {
            res.write(JSON.stringify(data, null, 2))
            console.log('标准输出：' + data);
        });

        last.on('exit', function(code) {
            console.log('子进程已关闭，代码：' + code);
            res.end();
        });
        /*seo 方案*/
    } else if (req.url.pathname.indexOf("/archive.html") == 0) {
        var ejs = require('ejs'),
            path = '../app/archive.ejs',
            str1 = fs.readFileSync(path, 'utf8');
        if (req.url.search) {
            console.log(req.url.search);
            r.table("sinablog").filter({
                id: req.url.search.split('=')[1]
            }).run(connection, function(err, cursor) {
                if (err) throw err;
                cursor.toArray(function(err, result) {
                    if (err) throw err;
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });

                    if (result.length > 0) {
                        res.write(result[0].content);
                    } else {
                        res.write('');
                    }

                    res.end();
                    console.log('数据查询成功');
                });
            });


        } else {
            r.table("sinablog").orderBy(r.desc('blogtime')).without('content').run(connection, function(err, cursor) {
                if (err) throw err;
                cursor.toArray(function(err, result) {
                    if (err) throw err;
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });

                    var ret = ejs.render(str1, {
                        data: result,
                    });
                    res.write(ret);
                    res.end();
                    console.log('数据查询成功');
                });
            });
        }

    } else {
        var path = ('./' + req.url.pathname).replace('//', '/').replace(/%(..)/g, function(match, hex) {
            return String.fromCharCode(parseInt(hex, 16));
        });
        var parts = path.split('/');

        if (path == './') {
            return self.sendFile_(req, res, './index.html');
        }; //默认首页路由

        if (StaticServlet.MimeMap[path.split('.').pop()] == undefined) {
            return self.sendFile_(req, res, './get.html'); //url路由控制关键部分
        }



        //seed 原始路由方法
        if (parts[parts.length - 1].charAt(0) === '.')
            return self.sendForbidden_(req, res, path);
        fs.stat(path, function(err, stat) {
            if (err)
                return self.sendMissing_(req, res, path);
            if (stat.isDirectory())
                return self.sendDirectory_(req, res, path);
            return self.sendFile_(req, res, path);
        });

    }





}

StaticServlet.prototype.sendError_ = function(req, res, error) {
    res.writeHead(500, {
        'Content-Type': 'text/html'
    });
    res.write('<!doctype html>\n');
    res.write('<title>Internal Server Error</title>\n');
    res.write('<h1>Internal Server Error</h1>');
    res.write('<pre>' + escapeHtml(util.inspect(error)) + '</pre>');
    util.puts('500 Internal Server Error');
    util.puts(util.inspect(error));
};

StaticServlet.prototype.sendMissing_ = function(req, res, path) {
    path = path.substring(1);
    res.writeHead(404, {
        'Content-Type': 'text/html'
    });
    res.write('<!doctype html>\n');
    res.write('<title>404 Not Found</title>\n');
    res.write('<h1>Not Found</h1>');
    res.write(
        '<p>The requested URL ' +
        escapeHtml(path) +
        ' was not found on this server.</p>'
    );
    res.end();
    util.puts('404 Not Found: ' + path);
};

StaticServlet.prototype.sendForbidden_ = function(req, res, path) {
    path = path.substring(1);
    res.writeHead(403, {
        'Content-Type': 'text/html'
    });
    res.write('<!doctype html>\n');
    res.write('<title>403 Forbidden</title>\n');
    res.write('<h1>Forbidden</h1>');
    res.write(
        '<p>You do not have permission to access ' +
        escapeHtml(path) + ' on this server.</p>'
    );
    res.end();
    util.puts('403 Forbidden: ' + path);
};

StaticServlet.prototype.sendRedirect_ = function(req, res, redirectUrl) {
    res.writeHead(301, {
        'Content-Type': 'text/html',
        'Location': redirectUrl
    });
    res.write('<!doctype html>\n');
    res.write('<title>301 Moved Permanently</title>\n');
    res.write('<h1>Moved Permanently</h1>');
    res.write(
        '<p>The document has moved <a href="' +
        redirectUrl +
        '">here</a>.</p>'
    );
    res.end();
    util.puts('301 Moved Permanently: ' + redirectUrl);
};

StaticServlet.prototype.sendFile_ = function(req, res, path) {
    var self = this;
    var file = fs.createReadStream(path);
    res.writeHead(200, {
        'Content-Type': StaticServlet.
        MimeMap[path.split('.').pop()] || 'text/plain'
    });
    if (req.method === 'HEAD') {
        res.end();
    } else {
        file.on('data', res.write.bind(res));
        file.on('close', function() {
            res.end();
        });
        file.on('error', function(error) {
            self.sendError_(req, res, error);
        });
    }
};

StaticServlet.prototype.sendDirectory_ = function(req, res, path) {
    var self = this;
    if (path.match(/[^\/]$/)) {
        req.url.pathname += '/';
        var redirectUrl = url.format(url.parse(url.format(req.url)));
        return self.sendRedirect_(req, res, redirectUrl);
    }
    fs.readdir(path, function(err, files) {
        if (err)
            return self.sendError_(req, res, error);

        if (!files.length)
            return self.writeDirectoryIndex_(req, res, path, []);

        var remaining = files.length;
        files.forEach(function(fileName, index) {
            fs.stat(path + '/' + fileName, function(err, stat) {
                if (err)
                    return self.sendError_(req, res, err);
                if (stat.isDirectory()) {
                    files[index] = fileName + '/';
                }
                if (!(--remaining))
                    return self.writeDirectoryIndex_(req, res, path, files);
            });
        });
    });
};

StaticServlet.prototype.writeDirectoryIndex_ = function(req, res, path, files) {
    path = path.substring(1);
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    if (req.method === 'HEAD') {
        res.end();
        return;
    }
    res.write('<!doctype html>\n');
    res.write('<title>' + escapeHtml(path) + '</title>\n');
    res.write('<style>\n');
    res.write('  ol { list-style-type: none; font-size: 1.2em; }\n');
    res.write('</style>\n');
    res.write('<h1>Directory: ' + escapeHtml(path) + '</h1>');
    res.write('<ol>');
    files.forEach(function(fileName) {
        if (fileName.charAt(0) !== '.') {
            res.write('<li><a href="' +
                escapeHtml(fileName) + '">' +
                escapeHtml(fileName) + '</a></li>');
        }
    });
    res.write('</ol>');
    res.end();
};

// Must be last,
main(process.argv);

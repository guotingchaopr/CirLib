var http = require('http');
var express = require('express');
var app = express();
app.use(express.logger());
app.use("/", express.static(__dirname + '/static'));
app.get("/",function(req,res,next){
     console.log(" req_url : " + req.url);
     res.redirect('/index.htm');
});
// 创建服务端
http.createServer(app).listen('8080', function () {
	console.log('启动服务器完成');
});

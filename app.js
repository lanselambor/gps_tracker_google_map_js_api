// var app = require('express')()
//   , server = require('http').createServer(app)
//   , io = require('socket.io').listen(server);
//
// var express = require('express');
// var path = require('path');
//
// server.listen(3000);
//
// app.use(express.static(path.join(__dirname, 'public')))
//
// io.sockets.on('connection', function (socket) {
//   console.log("A new user connected!");
//   setInterval(function(){
//     socket.broadcast.emit("marker",{'lat': 22.584358, 'lng': 113.96666});
//   }, 5000);
// });

// io.socket.on("disconnect", function(socket){
//     console.log("A user disconnected!!");
// });


var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')))

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

var io = require('socket.io').listen(server);
var coor_lat = 22.584358;
var coor_lng = 113.96666;

io.sockets.on('connection', function (socket) {
    console.log("A new user connected!");
    setInterval(function(){
        coor_lat += (Math.random() / 100);
        coor_lng += (Math.random() / 100);
        socket.broadcast.emit("marker",{'lat': coor_lat, 'lng': coor_lng});
    }, 5000);
});
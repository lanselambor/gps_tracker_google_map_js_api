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
        coor_lat += (Math.random() / 5000.0);
        coor_lng += (Math.random() / 5000.0);
        socket.broadcast.emit("marker",{'lat': coor_lat, 'lng': coor_lng});
        var date = Date();
        console.log("Emited new coordinate!" + " : " + date);
    }, 2000);
});

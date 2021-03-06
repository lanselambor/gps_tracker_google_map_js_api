// server.js

// BASE SETUP
// =============================================================================

// var Bear     = require('./app/models/bear');

// var mongoose   = require('mongoose');
// mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database



// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var path = require('path');

// global variable
var window_NS = "";
var window_WE = "";
var window_lat = 0.0;
var window_lng = 0.0;
var window_lat_old = 0.0;
var window_lng_old = 0.0;

app.use(express.static(path.join(__dirname, 'public')));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3001;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
// router.use(function(req, res, next) {
//     // do logging
//     var content = req.body.name;
//     console.log("Received: " + content);
//     res.json({ message: 'Bear created!' });
//     // console.log('Something is happening.');
//     next(); // make sure we go to the next routes and don't stop here
// });


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
// router.get('/', function(req, res) {
//     res.json({ message: 'hooray! welcome to our api!' });
// });


// on routes that end in /bears
// ----------------------------------------------------
router.route('/latlng');

var new_messsage = 0;
// Deal with POST event
router.route('/latlng/:data').post(function(req, res) {  // POST /api/latlng/N&225837666&E&1139667733/ HTTP/1.0
        var str = req.params.data.toString();
        console.log(str);
        var latlng = str.split("&");
        window_NS = latlng[0];
        window_lat = Number(latlng[1])/10000000;
        window_WE = latlng[2];
        window_lng = Number(latlng[3])/10000000;
        
        var date = new Date();
        console.log(date + ": ");
        console.log("lat: " + window_NS + window_lat.toString());
        console.log("lng: " + window_WE + window_lng.toString());
        // res.json({message: 'Return: ' + window_lat + ", " +window_lng});
        res.send(date + ":\r\n" + window_NS + window_lat + ", " + window_WE + window_lng + "\r\nOK\r\n");
        new_messsage = 1;
});



// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
var server = app.listen(port);

var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
        console.log("A new user connected!");
        setInterval(function(){
                if(new_messsage == 1){
                        new_messsage = 0;
                        socket.broadcast.emit("marker",{'ns': window_NS, 'lat': window_lat, 'we': window_WE, 'lng': window_lng});
                        var date = new Date();
                        console.log("Emited new coordinate!" + " : " + date);        
                        window_lat_old = window_lat;
                        window_lng_old = window_lng;
                }
        }, 500);
});

console.log('Service on port ' + port);

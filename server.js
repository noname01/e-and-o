var express = require("express");
var path = require("path");
var routes = require("./routes");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// config
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/', routes.index);
app.get("*", routes.index);

// socket.io
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

// start server
http.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
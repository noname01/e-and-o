var express = require("express");
var path = require("path");
var routes = require("./routes");
var mapData = require("./mapData.js");

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// config
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/', routes.index);
app.get("*", routes.index);

var waiting = null;
var roomCount = 0;

// socket.io
io.on("connection", function(socket){
    // namespace: roomX
    var room = "room";
    var map = mapData.generateMap();

    if(waiting === null){ // create a new room
        roomCount++;
        room += roomCount;
        waiting = room;
        console.log("create " + room);
        socket.join(room);
        socket.emit("waiting");
    }
    else{ // join a room
        room += roomCount;
        console.log("join room" + roomCount);
        socket.join(room);
        io.in(room).emit("find opponent");
        waiting = null;
        setTimeout(function(){
            io.in(room).emit("game starts", map);
        }, 3000)
    }

    console.log('a user connected');
    socket.on("message", function(msg){
        console.log("msg: " + msg);
        io.in(room).emit("message", msg);
    });
    socket.on("disconnect", function(){
        console.log("user disconnected");
        if(waiting === room){
            waiting = null;
        }
        io.in(room).emit("opponent left");
    });
});

// start server
http.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
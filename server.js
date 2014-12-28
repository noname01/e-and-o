var express = require("express");
var path = require("path");
var routes = require("./routes");
var roomData = require("./roomData.js");

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

var prevRole = null;
var roomCount = 0;
var prevRoomData = null;

// socket.io
io.on("connection", function(socket){
    // namespace: roomX
    var role = null;
    var roomSharedData = null;

    if(prevRoomData === null){ // create a new room
        roomCount++;
        roomSharedData = roomData.generate();
        roomSharedData.roomId = "room" + roomCount;
        prevRoomData = roomSharedData;

        role = Math.random() > 0.5 ? "even" : "odd";
        socket.emit("init role", role);
        prevRole = role;

        socket.join(roomSharedData.roomId);
        socket.emit("waiting");
    }
    else{ // join a room
        roomSharedData = prevRoomData;
        roomSharedData.currentTurn = "odd";
        prevRoomData = null;

        role = prevRole == "even" ? "odd" : "even";
        socket.emit("init role", role);
        prevRole = null;

        socket.join(roomSharedData.roomId);
        io.in(roomSharedData.roomId).emit("find opponent");
        setTimeout(function(){
            io.in(roomSharedData.roomId).emit("game starts", roomSharedData);
        }, 3000)
    }

    socket.on("message", function(msg){
        io.in(roomSharedData.roomId).emit("message", msg);
    });

    socket.on("set number", function(x, y, num, numberIndex){
        //if canSet && map[x][y] === null etc
        roomSharedData.map[x][y] = num;
        roomSharedData.numberDataPair[role][num % 2 == 0 ? "even" : "odd"]["available"][numberIndex] = false;
        roomSharedData.currentTurn = roomSharedData.currentTurn === "odd" ? "even" : "odd";
        io.in(roomSharedData.roomId).emit("update room data", roomSharedData);
    });

    socket.on("disconnect", function(){
        console.log("user disconnected");
        if(prevRoomData && prevRoomData.roomId === roomSharedData.roomId){
            prevRole = null;
            prevRoomData = null;
        }
        io.in(roomSharedData.id).emit("opponent left");
    });
});

// start server
http.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
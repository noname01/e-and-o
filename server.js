var express = require("express");
var path = require("path");
var routes = require("./routes");
var mapData = require("./mapData.js");
var numberData = require("./numberData.js");

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
var prevRole = null;
var roomCount = 0;

// socket.io
io.on("connection", function(socket){
    // namespace: roomX
    var room = "room";
    var map = mapData.generateMap();
    var role = null;
    var gameNumberData = numberData.partition();

    if(waiting === null){ // create a new room
        roomCount++;
        room += roomCount;
        waiting = room;
        role = Math.random() > 0.5 ? "even" : "odd";

        socket.emit("init", role);
        prevRole = role;
        console.log("create " + room + " role:" + role);
        socket.join(room);
        socket.emit("waiting");
    }
    else{ // join a room
        room += roomCount;
        role = prevRole == "even" ? "odd" : "even";
        socket.emit("init", role);
        prevRole = null;
        console.log("join room" + roomCount + " role:" + role);
        socket.join(room);
        io.in(room).emit("find opponent");
        waiting = null;
        setTimeout(function(){
            io.in(room).emit("game starts", map, gameNumberData);
        }, 3000)
    }

    console.log('a user connected');
    socket.on("message", function(msg){
        console.log("msg: " + msg);
        io.in(room).emit("message", msg);
    });

    socket.on("set number", function(x, y, dataIndex, num, numberIndex){
        map[x][y] = num;
        gameNumberData[dataIndex][num%2==0?"even":"odd"].splice(numberIndex, 1);
        io.in(room).emit("update game state", map, gameNumberData);
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
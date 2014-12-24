var app = angular.module("app", []);
var socket = io();

app.controller("gameCtrl", function($scope){

    $scope.map = new Array(5);
    for(var i = 0; i < 5; i++){
        $scope.map[i] = new Array(5);
    }
    for(var i = 0; i < 5; i++){
        for(var j = 0; j < 5; j++){
            $scope.map[i][j] = null;
        }
    }

    console.log($scope.map);

    $scope.messages = [];

    socket.on("waiting", function(){
        updateMessages($scope, "waiting for opponent...");
    });

    socket.on("find opponent", function(){
        updateMessages($scope, "opponent found. game will start soon.");
    });

    socket.on("opponent left", function(){
        updateMessages($scope, "opponent left. refresh to start a new game.");
    });

    socket.on("message", function(msg){
        updateMessages($scope, "chat:" + msg);
    });

    socket.on("game starts", function(mapData){
        updateMessages($scope, "game starts.");
        $scope.map = mapData;
        console.log($scope.map);
        $scope.$apply();
    });

    $scope.sendMessage = function(){
        socket.emit("message", $scope.textInput);
        $scope.textInput = "";
    };

});

function updateMessages($scope, msg){
    $scope.messages.push(msg);
    $scope.$apply();
}
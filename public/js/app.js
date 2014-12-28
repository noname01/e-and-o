var app = angular.module("app", []);
var socket = io();

app.controller("gameCtrl", function($scope){

    $scope.selected = null;
    $scope.selectedIndex = -1;
    $scope.currentTurn = null;

    $scope.map = new Array(5);
    for(var i = 0; i < 5; i++){
        $scope.map[i] = new Array(5);
    }
    for(var i = 0; i < 5; i++){
        for(var j = 0; j < 5; j++){
            $scope.map[i][j] = null;
        }
    }

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

    socket.on("init role", function(role){
        $scope.role = role;
    });

    socket.on("game starts", function(roomData){
        $scope.numbers = roomData.numberDataPair[$scope.role];
        $scope.map = roomData.map;
        $scope.currentTurn = roomData.currentTurn;
        updateMessages($scope, "game starts.");
        updateMessages($scope, "your role is " + $scope.role);
        updateMessages($scope, $scope.role === $scope.currentTurn ? "Your turn." : "Opponent's turn.");
    });

    socket.on("update room data", function(roomData){
        $scope.numbers = roomData.numberDataPair[$scope.role];
        $scope.map = roomData.map;
        $scope.currentTurn = roomData.currentTurn;
        updateMessages($scope, $scope.role === $scope.currentTurn ? "Your turn." : "Opponent's turn.");
    });

    $scope.sendMessage = function(){
        socket.emit("message", $scope.textInput);
        $scope.textInput = "";
    };

    $scope.changeSelected = function(num, index){
        if(!$scope.numbers[num % 2 == 0 ? "even" : "odd"].available[index]) return;
        $scope.selected = num;
        $scope.selectedIndex = index;
    };

    $scope.setNumber = function(x, y){
        if($scope.selected !== null && $scope.map[x][y] === null && $scope.currentTurn === $scope.role){
            socket.emit("set number", x, y, $scope.selected, $scope.selectedIndex);
            $scope.selected = null;
        }
    }

});

function updateMessages($scope, msg){
    $scope.messages.push(msg);
    $scope.$apply();
}
var app = angular.module("app", []);
var socket = io();

app.controller("gameCtrl", function($scope){

    $scope.selected = null;
    $scope.selectedIndex = -1;
    $scope.canSet = true;

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

    socket.on("init", function(role, nums){
        $scope.role = role;
    });

    socket.on("game starts", function(mapData, numberData){
        $scope.evenNumbers = numberData.even;
        $scope.oddNumbers = numberData.odd;
        $scope.map = mapData;
        updateMessages($scope, "game starts.");
        updateMessages($scope, "your role is " + $scope.role);
        //console.log($scope.map);
        $scope.$apply();
    });

    socket.on("update map", function(mapData){
        $scope.map = mapData;
        $scope.$apply();
    });

    socket.on("update numbers", function(numberData){
        $scope.evenNumbers = numberData.even;
        $scope.oddNumbers = numberData.odd;
        $scope.$apply();
    });

    $scope.sendMessage = function(){
        socket.emit("message", $scope.textInput);
        $scope.textInput = "";
    };

    $scope.changeSelected = function(num, index){
        $scope.selected = num;
        $scope.selectedIndex = index;
    }

    $scope.setNumber = function(x, y){
        if($scope.selected !== null && $scope.canSet){
            console.log("set "+x+y);
            socket.emit("set number", x, y, $scope.selected, $scope.selectedIndex);
            //$scope.canSet = false;
            $scope.selected = null;
        }
    }


});

function updateMessages($scope, msg){
    $scope.messages.push(msg);
    $scope.$apply();
}
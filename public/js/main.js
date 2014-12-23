var socket = io();

$(window).load(function(){
    $("#sendMessage").click(function(){
        console.log("ss");
        var msg = $("#inputMessage").val();
        socket.emit("message", msg);
    });

    socket.on("waiting", function(){
        $("#status").html("Waiting for opponent");
    });

    socket.on("find opponent", function(){
        $("#status").html("Opponent found");
    });

    socket.on("opponent left", function(){
        $("#status").html("Opponent left. Please refresh.");
    });

    socket.on("message", function(msg){
        $("#messages").append("<li>"+msg+"</li>");
    });
});
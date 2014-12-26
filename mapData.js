var width = 5;
var height = 5;

var prototype = new Array(height);

for(var i = 0; i < height; i++){
    prototype[i] = new Array(width);
}

for(var i = 0; i < height; i++){
    for(var j = 0; j < width; j++){
        prototype[i][j] = null;
    }
}


////stub
//prototype[2][2] = 2;
//prototype[0][1] = 5;
//prototype[3][2] = 1;
//prototype[2][4] = 6;

//console.log(prototype);

function generateMap(){
    return prototype;
}

module.exports = {
  generateMap: generateMap
};
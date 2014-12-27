var width = 5;
var height = 5;

function generateMap(){
    var map = new Array(height);

    for(var i = 0; i < height; i++){
        map[i] = new Array(width);
    }

    for(var i = 0; i < height; i++){
        for(var j = 0; j < width; j++){
            map[i][j] = null;
        }
    }

    return map;
}

module.exports = {
  generateMap: generateMap
};
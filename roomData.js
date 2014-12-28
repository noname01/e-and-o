var mapData = require("./mapData.js");
var numberData = require("./numberData.js");

var prototype = {
    roomId: null,
    map: mapData.generateMap(),
    numberDataPair: numberData.partition(),
    currentTurn: null,
    rowSum: [0, 0, 0, 0, 0],
    colSum: [0, 0, 0, 0, 0],
    score: {
        even: 0,
        odd: 0
    }
};

function generate(){
    return JSON.parse(JSON.stringify(prototype));
}

module.exports = {
    generate: generate
};
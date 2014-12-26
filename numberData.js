var evenNumbers = [0, 0, 2, 2, 4, 4, 6, 6, 8, 8];
var oddNumbers = [1, 1, 3, 3, 5, 5, 7, 7, 9, 9];

function partition(){
    var shuffledEven = shuffle(evenNumbers);
    var shuffledOdd = shuffle(oddNumbers);

    return [
        {
            even: shuffledEven.slice(0, evenNumbers.length / 2).sort(),
            odd: shuffledOdd.slice(0, oddNumbers.length / 2).sort()
        },
        {
            even: shuffledEven.slice(evenNumbers.length / 2, evenNumbers.length).sort(),
            odd: shuffledOdd.slice(oddNumbers.length / 2, oddNumbers.length).sort()
        }
    ];
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

module.exports = {
    partition: partition
};
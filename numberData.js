var numbers = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];

function partition(){
    var shuffled = shuffle(numbers);
    var a1 = shuffled.slice(0, numbers.length / 2).sort();
    var a2 = shuffled.slice(numbers.length / 2, numbers.length).sort();
    return [a1, a2];
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
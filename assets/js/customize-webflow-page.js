var clearWaterMarkInterval;
var counter = 0;
var maxTries = 100;

var clearWaterMark = function () {
    if (counter >= maxTries) {
        clearInterval(clearWaterMarkInterval);
    }

    counter++;
    var mark = $('a svg').closest('a');
    if (mark.length) {
        mark.hide();
        clearInterval(clearWaterMarkInterval);
    }
};

$('a svg').closest('a').hide();
clearWaterMarkInterval = setInterval(clearWaterMark, 100);

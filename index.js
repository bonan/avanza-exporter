var express = require("express");
var avanza = require("./avanza.js");

var metrics = {};

var app = express();

app.get('/metrics', function (req, res) {
    var ret = '';
    for (var code in metrics) {
        if (!metrics.hasOwnProperty(code)) continue;

        var opt = 'exchange="avanza",code="'+metrics[code].code+'",name="'+metrics[code].name+'"';
        if (metrics[code].type) {
            opt = opt + ',type="'+metrics[code].type+'"';
        }
        if (metrics[code].account) {
            opt = opt + ',account="'+metrics[code].account+'"';
        }

        for (var type in metrics[code]) {
            if (!metrics[code].hasOwnProperty(type)) continue;
            if (type == "name" || type == "type" || type == "account" || type == "code") continue;
            var name = 'stock_'+type;
            ret = ret + name + "{" + opt + "} " + metrics[code][type] + "\n";
        }
    }
    res.setHeader('Content-Type', 'text/plain');
    res.send(ret)
});

app.listen(8582, function () {
    console.log('Listening on port 8582')
});

avanza(process.env.EXCH_AZ_USERNAME, process.env.EXCH_AZ_PASSWORD, function (m) {
    metrics = m;
});

var az = require("avanza");
var avanza = new az.default();


module.exports = function(username, password, callback) {

    var az_position = {};
    var az_overview = {};
    var az_instruments = {};

    var getOverview = function() {
        avanza.getOverview().then(overview => {
            if (overview) {
                az_overview = overview;
            }
        }, err => {
            console.log(err);
        });
        setTimeout(getOverview, 900000);
    };

    var getInstrument = function(id) {
        if (az_instruments[id] == undefined) {
            avanza.getStock(id).then(stock => {
                if (stock) {
                    az_instruments[id] = stock;
                }
            }, err => {
                console.log(id, err);
            });
        }
    };

    var getPositions = function() {
        avanza.getPositions().then(positions => {
            if (positions) {
                az_position = positions;
                for (var k in az_position) {
                    if (!az_position.hasOwnProperty(k)) continue;
                    getInstrument(az_position[k].instrumentId);
                }
            }
        }, err => {
            console.log(err);
        });
        setTimeout(getPositions, 60000);
    };

    var exportMetrics = function() {
        setTimeout(exportMetrics, 30000);
        if (az_overview.accounts == undefined) return;
        var cap = 0;
        for (var j in az_overview.accounts) {
            if (!az_overview.accounts.hasOwnProperty(j)) continue;
            cap += az_overview.accounts[j].buyingPower;

        }

        var metrics = {
            CASH: {
                name: "Cash deposit",
                cash: cap
            }
        };

        for (var k in az_position) {
            if (!az_position.hasOwnProperty(k)) continue;
            var pos = az_position[k];
            var id = pos.instrumentId;
            if (!az_instruments[id]) continue;
            var stock = az_instruments[id];

            metrics[pos.accountId + "-" + id] = {
                name: stock.name,
                type: stock.marketPlace == 'Fondmarknaden' ? 'fund' : 'stock',
                code: stock.ticker,
                account: pos.accountId,
                amount: pos.volume,
                value: pos.value,
                rate: pos.value/pos.volume
            }
        }

        callback(metrics);

    };

    avanza.authenticate({username: username, password: password}).then(() => {
        getOverview();
        getPositions();
        exportMetrics();
    });

};

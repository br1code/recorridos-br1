const request = require("request");

let getPositions = (address, callback) => {
    let encodedAddress = encodeURIComponent(`${address} rosario`);

    request({
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
        json: true
    }, (error, response, body) => {
        if(!error && body.status === "OK") {
            callback(undefined, {
                dir: address,
                lat: body.results[0].geometry.location.lat,
                lon: body.results[0].geometry.location.lng
            });
        } else {
            callback("Unable to find that address");
        }
    })
};

module.exports.getPositions = getPositions;
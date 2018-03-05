const request = require("request");


let getPositions = (address, callback, attemps = 3) => {
    let encodedAddress = encodeURIComponent(`${address} rosario santafe argentina`);

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
            if (attemps) {
                console.log(`Unable to find that address or connect to API, attemps left : ${attemps}`);
                getPositions(address, callback, --attemps);
            } else {
                callback("Unable to find that address");
            }        
        }
    })
};

module.exports.getPositions = getPositions;
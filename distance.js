// return the distance in km between two address
let rad = (x) => {
    return x * Math.PI/180;
}

let getDistance = (address1, address2) => {
    const R = 6378.137;

    let lat1 = address1.lat;
    let lon1 = address1.lon;
    let lat2 = address2.lat;
    let lon2 = address2.lon;
    let dLat = rad(lat2 - lat1);
    let dLon = rad(lon2 - lon1);

    let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    let d = R * c;

    return d.toFixed(3);
};

module.exports.getDistance = getDistance;
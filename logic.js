const geocode = require("./geocode");
const distance = require("./distance");

global.recibos = [];
global.start = "";

// FUNCTIONS
// -----------------------------------------------------
function addRecibo(address, callback) {
    geocode.getPositions(address, (error, response) => {
        if (error) {
            callback("Unable to find that address");
        } else {
            if (start) { // if start is ready
                let recibo = response;
                recibos.push(recibo);
                console.log(`Recibo added to main list : ${response.dir}`);
            } else { // if start isnt ready yet
                start = response;
                console.log(`Start position ready : ${start.dir}`);
            }
            callback();
        }
    });
}

function sortRecibos(callback) {
    let recCopy = recibos.slice();
    let ordered = [];
    let init_start = start;

    for (let i = 0; i < recibos.length; i++) {
        // get a copy of actual recibos
        let rec = recCopy.slice();
        // calculate all distances from start to each recibo 
        rec.forEach((r, index) => {
            r.dist = distance.getDistance(start, r);
            r.index = index;
        });
        // get the closest one
        let closest = rec.reduce((a, b) => (a.dist < b.dist) ? a : b);
        // set it as new "start"
        start = closest;
        // add it to the list of ordered
        ordered.push(closest);
        // remove the closest one from the list
        recCopy.splice(closest.index, 1);
    }

    recibos = ordered;
    start = init_start;
    callback();
}

function removeRecibo(address, callback) {
    for (let i = 0; i < recibos.length; i++) {
        if (recibos[i].dir === address) { // if the recibo is found
            recibos.splice(i, 1);   // then delete from the main list
            console.log(`Recibo removed from the main list : ${address}`);
            i = recibos.length; // exit for loop
        }
    }
    callback();
}

function setTitle() {
    return (start) ? "Ingrese un recibo" : "Ingrese la dirección inicial";
}

module.exports = {
    addRecibo: addRecibo,
    sortRecibos: sortRecibos,
    setTitle: setTitle,
    removeRecibo: removeRecibo
};
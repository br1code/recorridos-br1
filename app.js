// input direccion inicial
// guardar posicion inicial(lat, lon)                                                    READY (setStart)
// ingresar recibos (si es correcto, pedir posicion (lat, lon) y guardar el recibo)
// una vez terminado de ingresar recibos, ordenar
const express = require("express");
const hbs = require("hbs");

const geocode = require("./geocode");
const distance = require("./distance");

const port = process.env.PORT || 3000;

var app = express();

app.set("view engine", "hbs");

var recibos = [];
var start = "";

// telling express to use static directory
app.use(express.static(__dirname + "/public"));

// ROUTES
// -----------------------------------------------------

app.get("/", (req, res) => {
    let address = req.query.address;
    if (address) {
        addRecibo(address, (err) => {
            if (!err) {
                res.render("index.hbs", {pageTitle: setTitle()});
            } else {
                res.render("index.hbs", {pageTitle: "Direccion no encontrada"});
            }       
        }); 
    } else {
        res.render("index.hbs", {pageTitle: setTitle()});
    } 
});

app.get("/sort", (req, res) => {
    sortRecibos(() => {
        res.render("sort.hbs",{recibos: recibos});
    })
});

app.get("/reset", (req, res) => {
    recibos = [];
    start = "";
    res.redirect("/");
});


// missing route, default (404)
app.get("*", (req, res) => {
    res.send("Ups, you are lost");
});

// -----------------------------------------------------
// server listening 
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});



// FUNCTIONS -------------------------------------------------------------
function addRecibo(address, callback) {
    geocode.getPositions(address, (error, response) => {    
        if (!error) { // if not error
            if (!start) { // if start isnt ready yet, set it
                start = response;
                console.log("Start position ready", start);
                callback();
            } else { // else add recibo
                let recibo = response;
                recibos.push(recibo);
                console.log("Recibo added to main list", JSON.stringify(recibos));
                callback();
            } 
        } else {
            callback("Unable to find that address");
        }
    });
}

function sortRecibos(callback) {
    let recCopy = recibos.slice();
    let ordered = [];

    for (let i = 0; i < recibos.length; i++) {
        // get a copy of actual recibos
        let rec = recCopy.slice();
        // calculate all distances from start to each recibo 
        rec.forEach((r,index) => {
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
    callback();
}

function setTitle() {
    return (start) ? "Ingrese un recibo" : "Ingrese la dirección inicial";
}
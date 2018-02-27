const express = require("express");
const hbs = require("hbs");

const logic = require("./logic");

const port = process.env.PORT || 3000;

var app = express();

app.set("view engine", "hbs");

global.recibos = [];
global.start = "";

// telling express to use static directory
app.use(express.static(__dirname + "/public"));

// ROUTES
// -----------------------------------------------------

app.get("/", (req, res) => {
    let address = req.query.address;
    if (address) {
        logic.addRecibo(address, (err) => {
            if (err) {
                res.render("index.hbs", {pageTitle: "Direccion no encontrada o error de conexión"});
            } else {
                res.render("index.hbs", {pageTitle: logic.setTitle()});
            }
        });
    } else {
        res.render("index.hbs", {pageTitle: logic.setTitle()});
    }
});

app.get("/sort", (req, res) => {
    logic.sortRecibos(() => {
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

// SERVER LISTENING
// -----------------------------------------------------
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

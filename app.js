const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");

const logic = require("./logic");

const port = process.env.PORT || 3000;

var app = express();

// CONFIGS
// -----------------------------------------------------

app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


// ROUTES
// -----------------------------------------------------

app.get("/", (req, res) => {
    res.render("index.hbs", {
        pageTitle: logic.setTitle(),
        recibos: recibos
    });
});

app.get("/error", (req, res) => {
    res.render("index.hbs", {
        pageTitle: "Direccion no encontrada o error de conexión",
        recibos: recibos
    });
})

app.get("/remove/:address", (req, res) => {
    let address = req.params.address;
    logic.removeRecibo(address, () => {
        logic.sortRecibos(() => {
            res.redirect("/");
        });
    });
});

app.post("/add", (req, res) => {
    let address = req.body.address;
    logic.addRecibo(address, error => {
        if (error) {
            res.redirect("/error");
        } else {
            logic.sortRecibos(() => {
                res.redirect("/");
            })
        }
    });
});

app.post("/reset", (req, res) => {
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

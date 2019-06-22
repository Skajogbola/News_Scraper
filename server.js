var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();
// Set Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Routes
require("./routes/scrape-routes.js")(app);
require("./routes/index-routes.js")(app);
require("./routes/saved-routes.js")(app);

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoScraper database
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";
mongoose.connect(MONGODB_URI);
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// // Database configuration with mongoose
// mongoose.connect("mongodb://heroku_thdwtncq:v0db4jti38s60tnr86cs97bvvo@ds161483.mlab.com:61483/heroku_thdwtncq");
// mongoose.connect("mongodb://heroku_wwsfpvv2:v0db4jti38s60tnr86cs97bvvo@ds035503.mlab.com:35503/:61483/heroku_wwsfpvv2");
// mongodb://<dbuser>:<dbpassword>
// var db = mongoose.connection;

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
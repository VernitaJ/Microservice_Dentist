require("dotenv").config();
var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");

// Variables
var port = process.env.NODE_DOCKER_PORT || 3001;

//  NOTE(numank): Replace URI with
//    `mongodb://localhost:${process.env.MONGODB_DOCKER_PORT}/dentistDB`
//    incase of use without docker
var mongoURI = `mongodb://mongodb:${process.env.MONGODB_DOCKER_PORT}/dentistDB`;

// Connect to MongoDB
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) {
      console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
      console.error(err.stack);
      process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
  }
);

// Create Express app
var app = express();
// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Enable cross-origin resource sharing for frontend must be registered before api
app.options("*", cors());
app.use(cors());

app.get("/", function (req, res) {
  res.json({
    message: "Default - Dentist Backend Microservice",
  });
});

// Error handler (i.e., when exception is thrown) must be registered last
var env = app.get("env");
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.error(err.stack);
  var err_res = {
    message: err.message,
    error: {},
  };
  if (env === "development") {
    // Return sensitive stack trace only in dev mode
    err_res["error"] = err.stack;
  }
  res.status(err.status || 500);
  res.json(err_res);
});

app.listen(port, function (err) {
  if (err) throw err;
  console.log(`Express server listening on port ${port}, in ${env} mode`);
});

module.exports = app;

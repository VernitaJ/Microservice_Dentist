var express = require("express");
var cors = require("cors");

// Variables
var port = 3000;

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
  console.log(`Dentist Backend Microservice: http://localhost:${port}/api/`);
});

module.exports = app;

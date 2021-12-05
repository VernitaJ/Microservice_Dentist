require("dotenv").config();
var mongoose = require("mongoose");
var mqtt = require("mqtt");

// NOTE(numank): Replace mongoURI with
//   `mongodb://localhost:${process.env.MONGODB_DOCKER_PORT}/dentistDB`
//   incase of use without docker.
var mongoURI = `mongodb://mongodb:${process.env.MONGODB_DOCKER_PORT}/dentistDB`;

// NOTE(numank): Replace brokerURI with
//   `mqtt://localhost:${process.env.BROKER_PORT}`
//   incase of use without docker.
//  This might create problems in the future.
var brokerURI = `mqtt://host.docker.internal:${process.env.BROKER_PORT}`;

var broker = mqtt.connect(brokerURI, {
  username: process.env.BROKER_USERNAME,
  password: process.env.BROKER_PASSWORD,
});

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

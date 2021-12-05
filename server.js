require("dotenv").config();
const mongoose = require("mongoose");
const mqtt = require("mqtt");
const requestEvaluator = require("./requestEvaluator");

// NOTE(numank): Replace mongoURI with
//   `mongodb://localhost:${process.env.MONGODB_DOCKER_PORT}/dentistDB`
//   incase of use without docker.
const mongoURI = `mongodb://mongodb:${process.env.MONGODB_DOCKER_PORT}/dentistDB`;

// NOTE(numank): Replace brokerURI with
//   `mqtt://localhost:${process.env.BROKER_PORT}`
//   incase of use without docker.
//  This might create problems in the future.
const brokerURI = `mqtt://host.docker.internal:${process.env.BROKER_PORT}`;

const mqttClient = mqtt.connect(brokerURI, {
  username: process.env.BROKER_USERNAME,
  password: process.env.BROKER_PASSWORD,
});

mqttClient.on("connect", function () {
  mqttClient.subscribe("import/dentist", (err) => {
    if (err) {
      console.log("Failed to connect import/dentist", err);
    }
  });
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

requestEvaluator(mqttClient);

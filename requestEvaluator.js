const importDentists = require("./importDentists");

module.exports = requestEvaluator = (mqttClient) => {
  mqttClient.on("message", function (topic, message) {
    if (topic === "import/dentist") {
      console.log("import message recieved");
      importDentists(message.toString());
    }
  });
};

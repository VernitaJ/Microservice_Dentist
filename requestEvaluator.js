const importDentists = require("./importDentists");
const handleRequest = require("./handleFrontendRequest");

module.exports = requestEvaluator = (mqttClient) => {
  mqttClient.on("message", function (topic, message) {
    if (topic === "import/dentist") {
      console.log("import message recieved");
      importDentists(message.toString(), mqttClient);
    } else if (topic === "frontend/dentist/req") {
      console.log("new frontend request recieved");
      handleFrontendRequest(message.toString(), mqttClient);
    }
  });
};

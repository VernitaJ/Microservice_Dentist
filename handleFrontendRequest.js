const dentistModel = require("./models/dentists");
/*
Expected request message
{
  "requestId": uniqueId,
  "requestType": getOne | getAll,
  "requestParams"?: {
    "id"?: id to search
  } 
}

Response message
{ status: statusCode, response: data }
*/

module.exports = handleFrontendRequest = async (req, mqttClient) => {
  const request = validateRequest(req);
  if (request) {
    var response = "";
    if (request.requestType === "getOne") {
      if (!request.requestParams.id) {
        response = JSON.stringify({ status: 400, response: "bad request" });
      } else {
        response = await getDentist(request.requestParams.id);
      }
    } else if (request.requestType === "getAll") {
      response = await getAllDentists();
    } else {
      response = JSON.stringify({
        status: 400,
        response: "invalid request type",
      });
    }

    mqttClient.publish(`frontend/dentist/${request.requestId}/res`, response);
  }
};

const getDentist = async (idToSearch) => {
  return await dentistModel
    .find({ id: idToSearch })
    .then((result) => {
      if (result === null) {
        return JSON.stringify({
          status: 404,
          response: `Dentist with id:${idToSearch} does not exist!`,
        });
      } else {
        return JSON.stringify({
          status: 200,
          response: result,
        });
      }
    })
    .catch((err) =>
      JSON.stringify({ status: 500, response: "internal error" })
    );
};

const getAllDentists = async () => {
  return await dentistModel
    .find({})
    .then((result) =>
      JSON.stringify({
        status: 200,
        response: result,
      })
    )
    .catch((err) =>
      JSON.stringify({ status: 500, response: "internal error" })
    );
};

const validateRequest = (req) => {
  try {
    const request = JSON.parse(req);
    if (!request.requestId) {
      return null;
    } else {
      return request;
    }
  } catch (err) {
    return null;
  }
};

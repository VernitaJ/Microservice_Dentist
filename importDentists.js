const dentistModel = require("./models/dentists");
module.exports = importDentists = (dataToImport, mqttClient) => {
  const dentistList = JSON.parse(dataToImport);
  dentistList.isArray
    ? dentistList.forEach((dentist) => importDentist(dentist, mqttClient))
    : importDentist(dentistList, mqttClient);
};

const importDentist = (dentist, mqttClient) => {
  try {
    const dentistObj = {
      id: dentist.id,
      name: dentist.name,
      owner: dentist.owner,
      dentists: dentist.dentists,
      address: dentist.address,
      city: dentist.city,
      coordinate: {
        longitude: dentist.longitude,
        latitude: dentist.latitude,
      },
      openingHours: {
        monday: dentist.monday,
        tuesday: dentist.tuesday,
        wednesday: dentist.wednesday,
        thursday: dentist.thursday,
        friday: dentist.friday,
      },
    };
    const newDentist = new dentistModel(dentistObj);
    newDentist
      .save()
      .then((dentist) => {
        console.log(`Dentist with id:${dentist.id} successfully imported.`);
        publishAvailableHoursToMng(dentist, mqttClient);
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(`Import error on id:${dentist.id}! `, err);
    return;
  }
};

const publishAvailableHoursToMng = (dentist, mqttClient) => {
  console.log("!!!!!!!!!!!!called!!!!!!!!!!!!");
  const openingHours = (({ id, dentists, openingHours }) => ({
    id,
    dentists,
    openingHours,
  }))(dentist);
  const payload = JSON.stringify({ openingHours });
  mqttClient.publish("dentist/openinghour", payload);
};

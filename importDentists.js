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
      email: dentist.email,
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
    const filter = { "id": dentistObj.id } 
    dentistModel.findOneAndUpdate(filter, dentistObj, {
      new: true,
      upsert: true, //Create new, if record doesn't exist.
      rawResult: true
    })
      .then((result) => {
        const action = result.lastErrorObject.updatedExisting ? "updated" : "imported"
        console.log(`Dentist with id:${result.value.id} successfully ${action}.`);
        publishAvailableHoursToMng(dentistObj, mqttClient);
        dentist.email && publishEmailToBookingMng(dentist, mqttClient);
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(`Import error on id:${dentist.id}! `, err);
    return;
  }
};

const publishAvailableHoursToMng = (dentist, mqttClient) => {
  const openingHours = (({ id, dentists, openingHours }) => ({
    id,
    dentists,
    openingHours,
  }))(dentist);
  const payload = JSON.stringify({ openingHours });
  mqttClient.publish("dentist/openinghour", payload);
};

const publishEmailToBookingMng = (dentist, mqttClient) => {
  const payload = JSON.stringify({ id: dentist.id.toString(), email: dentist.email });
  mqttClient.publish("dentist/email", payload);
};

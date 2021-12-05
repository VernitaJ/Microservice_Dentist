const dentistModel = require("./models/dentists");
module.exports = importDentists = (dataToImport) => {
  const dentistList = JSON.parse(dataToImport);
  dentistList.isArray
    ? dentistList.forEach((dentist) => importDentist(dentist))
    : importDentist(dentistList);
};

const importDentist = (dentist) => {
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
      .then(() =>
        console.log(`Dentist with id:${dentist.id} successfully imported.`)
      )
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(`Import error on id:${dentist.id}! `, err);
    return;
  }
};

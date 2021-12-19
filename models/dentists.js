var mongoose = require("mongoose");
const { Schema } = mongoose;

const dentistSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  owner: { type: String },
  dentists: { type: Number, required: true },
  address: { type: String },
  city: { type: String },
  email: { type: String },
  coordinate: {
    type: { type: Object },
    longitude: String,
    latitude: String,
  },
  openingHours: {
    monday: { type: String, required: true },
    tuesday: { type: String, required: true },
    wednesday: { type: String, required: true },
    thursday: { type: String, required: true },
    friday: { type: String, required: true },
  },
});

module.exports = mongoose.model("Dentist", dentistSchema);

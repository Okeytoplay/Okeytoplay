const mongoose = require("mongoose");

const { Schema } = mongoose;

const EstablishmentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  description: String,
  website: String,
  instagramProfile: String,
  facebookProfile: String,
  street: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: Number, required: true },
  capacity: { type: Number, required: true }
});

const Establishment = mongoose.model("Establishment", EstablishmentSchema);

module.exports = Establishment;

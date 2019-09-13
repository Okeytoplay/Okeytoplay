const mongoose = require('mongoose');

const { Schema } = mongoose;

const EstablishmentSchema = new Schema({
  description: String,
  website: String,
  instagramProfile: String,
  facebookProfile: String,
  street: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: Number, required: true },
  capacity: Number,
});

const Establishment = mongoose.model('Establishment', EstablishmentSchema);

module.exports = Establishment;

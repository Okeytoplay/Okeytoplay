const mongoose = require('mongoose');

const { Schema } = mongoose;

const EstablishmentSchema = new Schema({
  name: String,
  description: String,
  website: String,
  instagramProfile: String,
  facebookProfile: String,
  street: { type: String },
  city: { type: String },
  zip: { type: Number },
  capacity: Number,
  avatar: String,
});

const Establishment = mongoose.model('Establishment', EstablishmentSchema);

module.exports = Establishment;

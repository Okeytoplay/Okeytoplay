const mongoose = require('mongoose');

const { Schema } = mongoose;

const BandSchema = new Schema({
  name: { type: String },
  genre: { type: String },
  description: String,
  website: String,
  instagramProfile: String,
  facebookProfile: String,
  avatar: { type: String },
});

const Band = mongoose.model('Band', BandSchema);

module.exports = Band;

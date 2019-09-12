const mongoose = require("mongoose");

const { Schema } = mongoose;

const BandSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  description: String,
  website: String,
  instagramProfile: String,
  facebookProfile: String,
  bandMembers: [{ artistName: String, artistInstrument: String }]
});

const Band = mongoose.model("Band", BandSchema);

module.exports = Band;

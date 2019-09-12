const mongoose = require("mongoose");

const { Schema } = mongoose;

const BandSchema = new Schema({
  description: String,
  website: String,
  instagramProfile: String,
  facebookProfile: String,
  bandMembers: [{ artistName: String, artistInstrument: String }]
});

const Band = mongoose.model("Band", BandSchema);

module.exports = Band;

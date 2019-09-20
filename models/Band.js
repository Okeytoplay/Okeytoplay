const mongoose = require('mongoose');

const { Schema } = mongoose;

const BandSchema = new Schema({
  name: { type: String },
  genre: { type: String },
  description: String,
  website: String,
  instagramProfile: String,
  facebookProfile: String,
  avatar: String,
  bandmembers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  petitions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  requests: { type: String, default: 'Abiertas' },
});

const Band = mongoose.model('Band', BandSchema);

module.exports = Band;

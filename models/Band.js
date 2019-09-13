const mongoose = require('mongoose');

const { Schema } = mongoose;

const bandSchema = new Schema(
  {
    // username:{ type: String, required: true },
    // email: { type: String, required: true, unique: true },
    // hashedPassword: { type: String, required: true },
    // bandName: { type: String },
    // establishmentName: { type: String },
    image: String,
    genre: { type: String, required: true },
    bandMembers: [{ artistName: String, artistInstrument: String }],
    web: { type: String },
    instagramProfile: String,
    facebookProfile: String,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Band = mongoose.model('Band', bandSchema);

module.exports = Band;

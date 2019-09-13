const mongoose = require("mongoose");

const { Schema } = mongoose;

const bandSchema = new Schema(
  {
    genre: { type: String, required: true },
    // username:{ type: String, required: true },
    // email: { type: String, required: true, unique: true },
    // hashedPassword: { type: String, required: true },
    // bandName: { type: String },
    // establishmentName: { type: String },
    web: { type: String },
    instagramProfile: String,
    facebookProfile: String,
    bandMembers: [{ artistName: String, artistInstrument: String }]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Band = mongoose.model("Band", bandSchema);

module.exports = Band;

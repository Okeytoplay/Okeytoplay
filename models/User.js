const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    description: String,
    website: String,
    instagramProfile: String,
    facebookProfile: String,

    //Establishment (habilitar per imatges va aqui?)
    establishmentName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: Number, required: true },
    capacity: { type: Number, required: true },

    //Band
    bandName: { type: String, required: true },
    bandMembers: { type: Number, required: true }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

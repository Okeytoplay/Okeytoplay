const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    role: {
      grupie: { type: Boolean, default: true },
      band: { type: Boolean },
      establishment: { type: Boolean },
    },
    // roles: [{ type: String }],
    telephone: { type: Number },
    bandName: { type: String },
    establishmentName: { type: String },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;

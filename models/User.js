const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    role: {
      grupie: { type: Boolean, default: true },
      band: { type: Boolean, default: false },
      establishment: { type: Boolean, default: false },
    },
    telephone: { type: Number },
    band: { type: ObjectId, ref: 'Band' },
    establishment: { type: ObjectId, ref: 'Establishment' },
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

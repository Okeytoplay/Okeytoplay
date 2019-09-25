const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const eventSchema = new Schema({
  name: String,
  description: String,
  schedule: Date,
  startTime: String,
  establishment: {
    type: ObjectId,
    ref: 'Establishment',
  },
  band: {
    type: ObjectId,
    ref: 'Band',
  },
  price: {
    type: Number,
    default: 0,
  },
  durationMins: {
    type: Number,
    min: 0,
  },
  registeredUsers: [{ type: ObjectId, ref: 'User' }],
  petitions: [{ type: Schema.Types.ObjectId, ref: 'Band' }],
  requestOpened: { type: Boolean, default: true },
});

module.exports = mongoose.model('Event', eventSchema);

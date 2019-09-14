const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const eventSchema = new Schema({
  name: String,
  establishmentId: {
    type: ObjectId,
    ref: 'Establishment',
  },
  schedule: Date,
  description: String,
  bandId: {
    type: ObjectId,
    ref: 'Band',
  },
  price: {
    type: Number,
    default: 0,
  },
  durationMins: {
    type: Number,
    min: 15,
  },
  registeredUsers: [{ type: ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Event', eventSchema);

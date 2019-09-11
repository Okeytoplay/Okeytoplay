const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const eventsSchema = new Schema(
  {
    title: String,
    establishmentName: {
      type: ObjectId,
      ref: "User"
    },
    days: {
      type: String,
      default: "Undefined",
      enum: [
        "Undefined",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ]
    },
    schedule: Date,
    description: String,
    bandName: {
      type: ObjectId,
      ref: "User"
    },
    price: {
      type: Number,
      min: 1
    },
    duration: {
      type: Number,
      min: 15
    }
  },
    timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
}
);

module.exports = mongoose.model("Event", eventsSchema);

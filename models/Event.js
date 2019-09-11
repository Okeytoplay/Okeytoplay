const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const eventSchema = new Schema(
  {
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
      default: "Free",//Puc posar un string com a default?
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

module.exports = mongoose.model("Event", eventSchema);

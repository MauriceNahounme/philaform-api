const mongoose = require("mongoose");
const { isEmail } = require("validator");

const memberSchema = mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, required: true },
    family: { type: String, required: true },
    adult: { type: String },
    children: { type: String },
    car: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);

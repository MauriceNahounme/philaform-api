const mongoose = require("mongoose");
const { isEmail } = require("validator");

const memberSchema = mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    street: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: [isEmail] },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);

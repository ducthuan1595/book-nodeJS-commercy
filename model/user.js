const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "F1",
    },
    cart: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
        quantity: {
          type: Number,
        },
      },
    ],
    picture: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    address:
      {
        type: String,
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", schema);

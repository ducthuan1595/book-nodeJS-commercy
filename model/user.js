const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "F1",
    },
    cart: {
      items: [
        {
          itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", schema);

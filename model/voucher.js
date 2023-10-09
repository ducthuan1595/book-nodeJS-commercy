const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    expirationDate: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
    pic: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Voucher", schema);

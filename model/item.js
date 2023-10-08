const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    pic: [
      {
        type: Object,
        required: true,
      },
    ],
    detailPic: [{ type: Object, required: false }],
    priceInput: {
      type: Number,
      required: true,
    },
    pricePay: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    slogan: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    barcode: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    flashSaleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flashsale",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", schema);

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
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
        },
      },
    ],
    detailPic: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
        },
      },
    ],
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
    paid: {
      type: Number,
      default: 0
    },
    flashSaleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flashsale",
      default: null,
    },
    pages: {
      type: Number,
    },
    language: {
      type: String
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", schema);

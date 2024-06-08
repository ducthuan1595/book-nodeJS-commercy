const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    banner: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
      },
    },
    description: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    position: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", schema);

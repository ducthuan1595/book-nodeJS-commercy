const mongoose = require("mongoose")

const COLLECTION_NAME = 'categories'
const DOCUMENT_NAME = 'Category'

const schema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
    category_banner: {
      type: Object,
      required: true
    },
    category_description: {
      type: String
    },
    category_isActive: {
      type: Boolean,
      default: true,
    },
    category_position: {
      type: Number,
      default: 1
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

module.exports = mongoose.model(DOCUMENT_NAME, schema);

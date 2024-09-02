'use strict'

const mongoose = require("mongoose");

const COLLECTION_NAME = 'users'
const DOCUMENT_NAME = 'User'

const schema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    user_account: {
      type: String,
    },
    user_gender: {
      type: String,
    },
    user_email: {
      type: String,
      unique: true,
      required: true,
    },
    user_password: {
      type: String,
      require: true
    },
    user_status: {
      type: String,
      default: 'inactive',
      enum: ['active', 'inactive']
    },
    user_role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permission'
    },
    user_cart: [
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
    user_avatar: {
      link: Object,
      default: Buffer
    },
    user_address:
      {
        type: String,
      },
  },
  { timestamps: true, collection: COLLECTION_NAME }
  
);

module.exports = mongoose.model(DOCUMENT_NAME, schema);

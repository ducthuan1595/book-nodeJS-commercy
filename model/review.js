const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  comment: {
    type: String,
    require: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    require: true
  },
  stars: {
    type: Number,
    min: 1,
    max: 100
  }
}, {timestamps: true})

module.exports = mongoose.model('Review', schema);
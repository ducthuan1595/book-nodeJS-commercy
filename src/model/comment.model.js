
'use strict'

const {Schema, model} = require('mongoose')

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'comments'

const commentSchema = new Schema({
  comment_userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment_itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  comment_content: {  
    type: String,
    required: true
  },
  comment_stars: {
    type: Number,
    min: [1, 'Rating must be above 1'],
    max: [5, 'Rating must be below 5'],
    set: (val) =>  Math.round(val * 10) / 10
  },
  comment_picture: {
    type: Array,
    default: []
  },
  comment_parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  comment_left: {
    type: Number,
    default: 0
  },
  comment_right: {
    type: Number,
    default: 0
  } 
}, {timestamps: true, collection: COLLECTION_NAME})

module.exports = model(DOCUMENT_NAME, commentSchema)

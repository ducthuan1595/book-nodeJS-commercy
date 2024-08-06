'use strict'

const { Schema, model } = require('mongoose')

const COLLECTION_NAME = 'api_keys'
const DOCUMENT_NAME = 'ApiKey'

const schema = new Schema({
    api_key: {
        type: String,
        required: true,
        unique: true
    },
    api_key_status: {
        type: Boolean,
        default: false
    },
    api_key_permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, schema)

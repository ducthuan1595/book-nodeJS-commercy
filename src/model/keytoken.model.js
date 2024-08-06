'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const COLLECTION_NAME = 'keys'
const DOCUMENT_NAME = 'Key'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    key_token_userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    key_token_publicKey:{
        type: String, 
        required: true
    },
    key_token_privateKey:{
        type: String,
        required: true
    },
    key_token_refreshToken:{
        type: String, required: true
    },
    key_token_refreshTokenUsed:{
        type: [String], default: []
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);

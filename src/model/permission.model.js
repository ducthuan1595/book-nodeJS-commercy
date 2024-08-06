const {Schema, model} = require('mongoose')

const DOCUMENT_NAME = 'Permission'
const COLLECTION_NAME = 'permissions'

const schema = new Schema(
    {
        permit_user: {
            type: Boolean,
            default: false
        },
        permit_moderator: {
            type: Boolean,
            default: false
        },
        permit_admin: {
            type: Boolean,
            default: false
        },
        permit_guest: {
            type: Boolean,
            default: true
        },
        permit_userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
);

module.exports = model(DOCUMENT_NAME, schema);
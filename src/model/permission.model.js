const {Schema, model} = require('mongoose');

const schema = new Schema(
    {
        user: Boolean,
        moderator: Boolean,
        admin: Boolean,
        guest: Boolean,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }
);

module.exports = model('Permission', schema);
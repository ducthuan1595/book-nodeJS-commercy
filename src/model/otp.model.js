const {Schema, model} = require('mongoose');

const OtpSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now(),
        index: {
            expires: 60
        }
    }
}, {
    collection: 'otp'
})

// OtpSchema.index({ time: 1 }, { expireAfterSeconds: 60 });

module.exports = model('Otp', OtpSchema);
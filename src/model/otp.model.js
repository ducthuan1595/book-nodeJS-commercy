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
            expires: 300
        }
    }
}, {
    collection: 'otp'
})

module.exports = model('Otp', OtpSchema);
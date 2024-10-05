'use strict';

const {verifyOtpService, sendAgainOtpService} = require('../service/otp.service');

var that = module.exports = {
    /**
     * 
     * @param {body: {email, otp}} req 
     * @param {message: 'Verify OTP success', metadata: await verifyOtpService(email, otp, res)} res 
     */
    verifyOtp: async(req, res, next) => {
        const {email, otp} = req.body;
        if(!email || !otp) {
            return res.status(400).json({
                message: 'Invalid information'
            })
        }

        const data = await verifyOtpService(email, otp, res);
        if(data) {
            return res.status(data.code).json(data)
        }
    },

    /**
     * 
     * @param {body: {email}} req 
     * @param {message: 'Send again OTP success', metadata: await sendAgainOtpService(email)} res 
     */
    sendAgainOtp: async(req, res, next) => {
        const {email} = req.body;
        if(!email) {
            return res.status(400).json({
                message: 'Invalid information'
            })
        }

        const data = await sendAgainOtpService(email);
        if(data) {
            return res.status(data.code).json(data)
        }
    
    }
}
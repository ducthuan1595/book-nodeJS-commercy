'use strict';

const {verifyOtpService, sendAgainOtpService} = require('../service/otp.service');

var that = module.exports = {
    verifyOtp: async(req, res, next) => {
        try{
            const {email, otp} = req.body;
            if(!email || !otp) {
                return res.status(400).json({
                    message: 'Invalid information'
                })
            }

            const data = await verifyOtpService(email, otp);
            if(data) {
                return res.status(data.code).json(data)
            }

        }catch(err) {
            console.log(err);
            res.status(500).json({message: 'Error from server', code: 500})
        }
    },

    sendAgainOtp: async(req, res, next) => {
        try{
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
        }catch(err) {
            res.status(500).json({message: 'Error from server', code: 500})
        }
    }
}
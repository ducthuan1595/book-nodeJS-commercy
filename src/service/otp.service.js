// 'use strict';

const bcrypt = require('bcrypt');
const _Otp = require('../model/otp.model');
const _User = require('../model/user.model');
const _Permission = require('../model/permission.model');
const {createOtp, insertOtp} = require('../util/otp');
const confirmMailer = require('../support/mails/confirmAccount');

var that = module.exports = {

    verifyOtpService: async(email, otp) => {
        try{
            const otpHold = await _Otp.find({email});
            if(!otpHold.length) {
                return {
                   message: 'Otp expired',
                   code: 404
                }
            }

            const lastOtp = otpHold[otpHold.length - 1];
            const isValid = await bcrypt.compare(otp, lastOtp.otp);
            if(!isValid) {
                return {
                    code: 401,
                    message: 'Invalid OTP'
                }
            }
            const user = await _User.findOne({email});
            if(user) {
                await _Otp.deleteMany({email});
                const updatePermit = await _Permission.findOneAndUpdate({_id: user.role}, {user: true});
                if(updatePermit){
                    return {
                        code: 201,
                        message: 'ok',
                        data: {
                            username: user.username,
                            email: user.email,
                            cart: user.cart,
                            gender: user?.gender,
                        },
                    }
                }
            }

        }catch(err) {
            console.error(err);
        }
    }, 

    sendAgainOtpService: async(email) => {
        try{
            const user = await _User.findOne({email});
            if(!user) {
                return {
                    code: 401,
                    message: 'Invalid email'
                }
            }
            await _Otp.deleteMany({email});
            const otp = createOtp();
            confirmMailer(email, user.username, otp, null, null, () => {
                console.log("Send email successfully");
            });
            return {
                code: 201,
                message: "ok",
                data: await insertOtp(
                  email,
                  otp
                )
            };
        }catch(err) {
            console.error(err);
        }
    }
}
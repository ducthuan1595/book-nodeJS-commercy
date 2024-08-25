// 'use strict';

const bcrypt = require("bcrypt");
const _Otp = require("../model/otp.model");
const _User = require("../model/user.model");
const _Permission = require("../model/permission.model");
const { createOtp, insertOtp } = require("../util/otp");
const confirmMailer = require("../support/mails/confirmAccount");
const { getInfoData, publicKey, privateKey, setCookies } = require("../util");
const { NotFoundError, BadRequestError } = require("../core/error.response");
const KeyTokenService = require('./keyToken.service')
const {createToken} = require('../auth/token')

var that = (module.exports = {
  verifyOtpService: async (email, otp, res) => {
    const otpHold = await _Otp.find({ email });
    if (!otpHold.length) {
      throw new BadRequestError("Not found!");
    }

    const lastOtp = otpHold[otpHold.length - 1];

    const isValid = await bcrypt.compare(otp, lastOtp.otp);
    if (!isValid) {
      throw new NotFoundError("Invalid OTP");
    }
    const user = await _User.findOne({ user_email: email });

    if (!user) {
      throw new NotFoundError("Not found user by email!");
    }
    await _Otp.deleteMany({ email });
    const updatePermit = await _Permission.findOneAndUpdate(
      { _id: user.user_role },
      { permit_user: true }
    );
    if (updatePermit) {
      console.log({publicKey, privateKey})
      const tokens = await createToken(
        { userId: user._id, email: user.user_email },
        publicKey(),
        privateKey()
      );

      const keyStore = await KeyTokenService.createKeyToken({
        userId: user._id,
        publicKey: publicKey(),
        privateKey: privateKey(),
        refreshToken: tokens.refreshToken,
      });

      if (!keyStore) throw new ErrorResponse("Error create key store");

      // set token into cookie
      setCookies(tokens, res);
      return {
        code: 201,
        message: "ok",
        data: {
          user: getInfoData({
            fields: [
              "_id",
              "user_name",
              "user_email",
              "user_cart",
              "user_gender",
              "user_avatar",
            ],
            object: user,
          }),
          tokens,
        },
      };
    }
  },

  sendAgainOtpService: async (email) => {
    try {
      const user = await _User.findOne({ user_email: email });
      if (!user) {
        return {
          code: 401,
          message: "Invalid email",
        };
      }
      await _Otp.deleteMany({ user_email: email });
      const otp = createOtp();
      confirmMailer(email, user.user_name, otp, null, null, () => {
        console.log("Send email successfully");
      });
      return {
        code: 201,
        message: "ok",
        data: await insertOtp(email, otp),
      };
    } catch (err) {
      console.error(err);
    }
  },
});

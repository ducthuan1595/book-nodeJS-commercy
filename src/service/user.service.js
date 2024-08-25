"use strict";

const _User = require("../model/user.model.js")
const bcrypt = require('bcrypt')

const { createToken } = require('../auth/token.js')
const {
  ErrorResponse,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../core/error.response.js");


class UserService {
  static getUser (page, limit, key, req)  {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await _User.findById(req.user._id);
        if (user && user.role !== "F1") {
          if (key) {
            const users = await _User
              .find({ username: key })
              .select("-password");
            if (users) {
              resolve({
                status: 200,
                message: "ok",
                data: users,
              });
            } else {
              resolve({
                status: 404,
                message: "Not found",
              });
            }
          } else {
            const users = await _User.find().select("-password");
            if (users) {
              resolve({
                status: 200,
                message: "ok",
                data: users,
              });
            }
          }
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  static updateUser (account, fullname, phone, gender, address, req) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await _User.findById(req.user._id).populate("cart.itemId");
        if (user) {
          user.accountName = account;
          user.phoneNumber = phone;
          user.username = fullname;
          user.gender = gender;
          user.address = address;
          const updateUser = await user.save();
          if (updateUser) {
            resolve({
              status: 201,
              message: "ok",
              data: updateUser,
              token: createToken(user._id),
            });
          }
        } else {
          resolve({
            status: 403,
            message: "Unauthorized",
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  static async updateAvatar (picture, req) {
      const user = await _User.findById(req.user._id).populate("cart.itemId");
      user.picture = picture;
      const updateUser = await user.save();
      return {
        status: 201,
        message: "ok",
        data: updateUser,
        token: createToken(updateUser._id),
      };
  }

  static async changePassword (password, req) {    
    const salt = await bcrypt.genSalt(10);
    const pw = await bcrypt.hash(password, salt);    

    const updateUser = await _User.findByIdAndUpdate(req.user.userId, {
      user_password: pw
    }, {new: true})
    
    return {
      status: 200,
      message: "ok",
      data: updateUser ? 1 : 0,
    };
  }

  static async  handleRefreshToken (user, keyToken, refreshToken) {
    const {email, userId} = user
    if(keyToken.key_token_refreshTokenUsed.includes(refreshToken)) {
      await _Key.findOneAndDelete({key_token_userId: userId})
      throw new ForbiddenError('Something wrong happen')
    }
    if(keyToken.key_token_refreshToken !== refreshToken) throw new AuthorizedFailError('Not found refresh token')

    const foundUser = await _User.findById(userId)
    if(!foundUser) throw new AuthorizedFailError('User is not register')

    const strPublicKey = publicKey(), strPrivateKey = privateKey()
    const tokens = await createToken({userId: user._id, email: user.user_email}, strPublicKey, strPrivateKey)

    const keyStore = await KeyTokenService.createKeyToken({
      userId: user._id,
      publicKey: strPublicKey,
      privateKey: strPrivateKey,
      refreshToken: tokens.refreshToken
    })

    if(!keyStore) throw new ErrorResponse('Error create key store')

    // set token into cookie
      setCookies(tokens, res)

      return {
        status: 201,
        message: "ok",
        data: {
          user: getInfoData({fields: ['_id', 'user_name', 'user_email', 'user_cart', 'user_gender', 'user_avatar'], object: foundUser}),
          tokens
        },
      };
  }
}

module.exports = UserService

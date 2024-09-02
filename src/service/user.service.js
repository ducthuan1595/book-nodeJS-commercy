"use strict";

const _User = require("../model/user.model.js")
const bcrypt = require('bcrypt')

const { createToken } = require('../auth/token.js')
const {
  ErrorResponse,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../core/error.response.js")
const { publicKey, privateKey, getInfoData , setCookies} = require("../util/index.js");
const KeyTokenService = require("./keyToken.service.js");

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

  static async updateUser ({user_name, user_account, user_gender, user_address, user}) {
    const update = {
      user_account,
      user_name,
      user_gender,
      user_address
    }, options = {upsert: true, new: true}

    const updateUser = await _User.findByIdAndUpdate(user.userId, update, options)
    
    return {
      status: 201,
      message: "ok",
      data: {
        user: getInfoData({fields: ['_id', 'user_name', 'user_email', 'user_cart', 'user_gender', 'user_avatar', 'user_account', 'user_address'], object: updateUser}),
      },
    }
  }

  static async updateAvatar (picture, userId) {
      const user = await _User.findById(userId).populate("user_cart.itemId");
      user.user_avatar.link = picture;
      const updateUser = await user.save();
      return {
        status: 201,
        message: "ok",
        data: {
          user: getInfoData({fields: ['_id', 'user_name', 'user_email', 'user_cart', 'user_gender', 'user_avatar', 'user_account', 'user_address'], object: updateUser}),
        },
      };
  }

  static async changePassword (password, user) {    
    const salt = await bcrypt.genSalt(10);
    const pw = await bcrypt.hash(password, salt);    

    const updateUser = await _User.findByIdAndUpdate(user.userId, {
      user_password: pw
    }, {new: true})
    
    return {
      status: 200,
      message: "ok",
      data: updateUser ? 1 : 0,
    };
  }

  static async  handleRefreshToken (user, keyToken, refreshToken, res) {
    const {email, userId} = user
    if(keyToken.key_token_refreshTokenUsed.includes(refreshToken)) {
      await _Key.findOneAndDelete({key_token_userId: userId})
      throw new ForbiddenError('Something wrong happen')
    }
    if(keyToken.key_token_refreshToken !== refreshToken) throw new AuthorizedFailError('Not found refresh token')

    const foundUser = await _User.findById(userId)
    if(!foundUser) throw new AuthorizedFailError('User is not register')

    const strPublicKey = publicKey(), strPrivateKey = privateKey()
    const tokens = await createToken({userId, email}, strPublicKey, strPrivateKey)

    const keyStore = await KeyTokenService.createKeyToken({
      userId: userId,
      publicKey: strPublicKey,
      privateKey: strPrivateKey,
      refreshToken: tokens.refreshToken,
      refreshTokenUsed: refreshToken
    })

    if(!keyStore) throw new ErrorResponse('Error create key store')

    // set token into cookie
      setCookies(tokens, res)

      return {
        status: 201,
        message: "ok",
        data: {
          user: getInfoData({fields: ['_id', 'user_name', 'user_email', 'user_cart', 'user_gender', 'user_avatar', 'user_account', 'user_address'], object: foundUser}),
          tokens
        },
      };
  }
}

module.exports = UserService

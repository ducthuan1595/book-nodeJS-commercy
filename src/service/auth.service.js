"use strict";

const bcrypt = require("bcrypt");
const crypto = require('node:crypto')

const _User = require("../model/user.model.js");
const _Permission = require("../model/permission.model.js");

// const { createToken, createRefreshToken } = require("../config/token");
const { createToken } = require('../auth/token.js')
const confirmMailer = require("../support/mails/confirmAccount");
const { getInfoUserGoogle } = require("../support/getInfoUserGoogle");
const { createOtp, insertOtp } = require("../util/otp.js");
const { generateAvatar } = require("../support/generalAvatar.js");
const {
  ErrorResponse,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../core/error.response.js");
const { createApiKey } = require("./apiKey.service.js");
const { findOneUserWithEmail } = require("../model/repositories/user.repo.js");
const {
  findByIdFromPermission,
  insertPermission,
} = require("../model/repositories/permission.repo.js");
const { findByIdAndUpdateFromUser } = require("../model/repositories/user.repo.js");
const KeyTokenService = require("./keyToken.service.js");
const { getInfoData } = require("../util/index.js");

const publicKey = crypto.randomBytes(32).toString('hex')
const privateKey = crypto.randomBytes(32).toString('hex')

var that = (module.exports = {
  login: async ({ user_email, user_password, res }) => {
    try {
      const user = await findOneUserWithEmail({ user_email });

      if (!user) {
        throw new NotFoundError("User is not exist");
      }
      const permit = await findByIdFromPermission(user?.user_role);
      if (permit && !permit.permit_user) {
        throw new BadRequestError("Please, check email to confirm");
      } else {
        const validPs = await bcrypt.compare(user_password, user.user_password);
        if (!validPs) {
          throw new ForbiddenError("Password incorrect!");
        }
        // const refresh_token = await createRefreshToken(user._id.toString());
        // const access_token = await createToken(user._id.toString());
        const tokens = await createToken({userId: user._id, email: user.user_email}, publicKey, privateKey)

        const keyStore = await KeyTokenService.createKeyToken({
          userId: user._id,
          publicKey,
          privateKey,
          refreshToken: tokens.refreshToken
        })

        if(!keyStore) throw new ErrorResponse('Error create key store')

        res.cookie("access_token", tokens.accessToken, {
          maxAge: 365 * 24 * 60 * 60 * 100,
          httpOnly: true,
          sameSite: "Lax",
          //secure: true;
        });
        res.cookie("refresh_token", tokens.refreshToken, {
          maxAge: 365 * 24 * 60 * 60 * 100,
          httpOnly: true,
          sameSite: "Lax",
          //secure: true;
        });

        return {
          status: 201,
          message: "ok",
          data: {
            user: getInfoData({fields: ['_id', 'user_name', 'user_email', 'user_cart', 'user_gender', 'user_avatar'], object: user}),
            // username: user.user_name,
            // email: user.user_email,
            // cart: user.user_cart,
            // gender: user?.user_gender,
            // avatar: user.user_avatar,
            tokens
          },
        };
      }
    } catch (err) {
      throw err
    }
  },

  credential: async (value, origin, res) => {
    try {
      let user;
      if (origin === "google") {
        user = await getInfoUserGoogle(value);
      } else {
      }
      if (user) {
        const userExist = await _User
          .findOne({ email: user.emailAddresses[0].value })
          .populate("cart.itemId", "-password");
        if (userExist) {
          user = userExist;
        } else {
          const newUser = new _User({
            email: user.emailAddresses[0].value,
            username: user.names[0].displayName,
            accountName: user.names[0].displayName,
            picture: {
              url: user.photos[0].url,
            },
            role: "F2",
          });
          user = await newUser.save();
        }
        if (user) {
          const refresh_token = await createRefreshToken(user._id.toString());
          const access_token = await createToken(user._id.toString());

          res.cookie("access_token", access_token, {
            maxAge: 365 * 24 * 60 * 60 * 100,
            httpOnly: true,
            //secure: true;
          });
          res.cookie("refresh_token", refresh_token, {
            maxAge: 365 * 24 * 60 * 60 * 100,
            httpOnly: true,
            //secure: true;
          });
          return {
            status: 201,
            message: "ok",
            data: user,
            token: {
              access_token,
              refresh_token,
            },
          };
        }
      }
    } catch (err) {
      return {
        status: 500,
        message: "Error from server",
      };
    }
  },

  loginAdmin: (email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await _User.findOne({ email: email });
        if (!user || user.role === "F1" || user.role === "F2") {
          resolve({
            status: 402,
            message: "Unauthorized",
          });
        } else {
          const validPs = await bcrypt.compare(password, user.password);
          if (validPs) {
            const refresh_token = await createRefreshToken(user._id.toString());
            const access_token = await createToken(user._id.toString());

            res.cookie("access_token", access_token, {
              maxAge: 365 * 24 * 60 * 60 * 100,
              httpOnly: true,
              //secure: true;
            });
            res.cookie("refresh_token", refresh_token, {
              maxAge: 365 * 24 * 60 * 60 * 100,
              httpOnly: true,
              //secure: true;
            });

            resolve({
              status: 201,
              message: "ok",
              data: {
                name: user.username,
                email: user.email,
              },
            });
          } else {
            resolve({
              status: 301,
              message: "Password is incorrect",
            });
          }
        }
      } catch (err) {
        reject(err);
      }
    });
  },

  signup: async ({ user_name, user_email, user_password, urlOrigin }) => {
    try {
      const user = await _User.findOne({ user_email });
      if (user) throw new ForbiddenError("Email already exist!");

      const salt = await bcrypt.genSalt(10);
      const pw = await bcrypt.hash(user_password, salt);
      let newUser = new _User({
        user_name,
        user_email,
        user_password: pw,
        user_avatar: {
          default: generateAvatar(user_name),
        },
      });
      const addUser = await newUser.save();
      if (addUser) {
        const permit = await insertPermission({ userId: addUser._id })
        
        if (permit) {
          await findByIdAndUpdateFromUser(addUser._id, {
            user_role: permit._id,
          });
        }

        const otp = createOtp();
        confirmMailer(user_email, user_name, otp, urlOrigin, null, () => {
          console.log("Send email successfully");
        });
        return {
          status: 200,
          message: "ok",
          data: {
            otp: await insertOtp(user_email, otp),
            // apiKey: await createApiKey(),
          },
        };
      }
    } catch (err) {
      throw err
    }
  },

  confirm: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const addUser = await _User.findById(id);
        addUser.role = "F2";
        const updateUser = await addUser.save();
        if (updateUser) {
          resolve({
            status: 201,
            message: "ok",
            data: updateUser,
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  },

  forgotPassword: (email, urlOrigin) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await _User.findOne({ email: email });
        if (!user) {
          resolve({
            message: "User invalid",
          });
        } else {
          confirmMailer(
            email,
            user.username,
            null,
            urlOrigin,
            user._id.toString(),
            () => {
              console.log("Send email successfully!");
            }
          );
          resolve({
            status: 201,
            message: "ok",
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  },

  confirmPassword: (password, id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await _User.findById(id);
        if (user) {
          const pw = await bcrypt.hash(password, 12);
          user.password = pw;
          const updateUser = await user.save();
          if (updateUser) {
            resolve({
              status: 200,
              message: "ok",
              data: updateUser,
            });
          }
        } else {
          resolve({
            status: 404,
            message: "Not found user",
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  },

  getUser: (page, limit, key, req) => {
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
  },

  updateUser: (account, fullname, phone, gender, address, req) => {
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
  },

  updateAvatar: async (picture, req) => {
    try {
      const user = await _User.findById(req.user._id).populate("cart.itemId");
      user.picture = picture;
      const updateUser = await user.save();
      return {
        status: 201,
        message: "ok",
        data: updateUser,
        token: createToken(updateUser._id),
      };
    } catch (err) {
      return {
        status: 500,
        message: "Error from server",
      };
    }
  },
});

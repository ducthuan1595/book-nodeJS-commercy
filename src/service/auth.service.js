"use strict";

const bcrypt = require("bcrypt");
const _User = require("../model/user.model.js")
const _Cart = require('../model/cart.model.js')

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
  AuthorizedFailError,
} = require("../core/error.response.js");
const { findOneUserWithEmail, updatePermissionForUser } = require("../model/repositories/user.repo.js");
const {
  findByIdFromPermission,
} = require("../model/repositories/permission.repo.js");
const KeyTokenService = require("./keyToken.service.js");
const { getInfoData, setCookies, publicKey, privateKey } = require("../util/index.js");

var that = (module.exports = {
  login: async ({ user_email, user_password, res }) => {
    const user = await findOneUserWithEmail({ user_email })

    if (!user) {
      throw new NotFoundError("User is not exist");
    }
    const permit = await findByIdFromPermission(user?.user_role);
    if (permit && !permit.permit_user && !permit.permit_admin && !permit.permit_shop && !permit.permit_moderator) {
      throw new BadRequestError("Please, check email to confirm");
    }
      const validPs = await bcrypt.compare(user_password, user.user_password);
      if (!validPs) {
        throw new ForbiddenError("Password incorrect!");
      }
      const strPublicKey = publicKey(), strPrivateKey = privateKey()
      const tokens = await createToken({userId: user._id, email: user.user_email, permit}, strPublicKey, strPrivateKey)

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
        message: "ok",
        data: {
          user: getInfoData({fields: ['_id', 'user_name', 'user_email', 'user_cart', 'user_gender', 'user_avatar'], object: user}),
          tokens
        },
      };
      
  },

  credential: async (value, origin, res) => {
      let user;
      if (origin === "google") {
        user = await getInfoUserGoogle(value);
      }
      if (user) {
        const userExist = await _User
          .findOne({ email: user.emailAddresses[0].value })
          .populate("cart.itemId", "-password");
        if (userExist) {
          user = userExist;
        } else {
          const newUser = new _User({
            user_email: user.emailAddresses[0].value,
            user_name: user.names[0].displayName,
            user_account: user.names[0].displayName,
            user_avatar: {
              url: user.photos[0].url,
            },
            user_role: "F2",
          });
          user = await newUser.save();
        }
        if (user) {

          // update permission for user
          updatePermissionForUser(user, {isUser: true})

          // create tokens
          const tokens = await createToken({userId: user._id, email: user.user_email}, publicKey, privateKey)

          // set token into cookie
          setCookies(tokens, res)

          return {
            status: 201,
            message: "ok",
            data: {
              user: getInfoData({fields: ['_id', 'user_name', 'user_email', 'user_cart', 'user_gender', 'user_avatar'], object: user}),
              tokens
            }
          };
        }
      }
  },

  signup: async ({ user_name, user_email, user_password, urlOrigin }) => {
      const user = await _User.findOne({ user_email });
      if (user) throw new ForbiddenError("Email already exist!");

      const salt = await bcrypt.genSalt(10);
      const pw = await bcrypt.hash(user_password, salt)
      const cart = await _Cart.create({})
      let newUser = new _User({
        user_name,
        user_email,
        user_password: pw,
        user_cart: cart,
        user_avatar: {
          default: generateAvatar(user_name),
        },
      });
      const addUser = await newUser.save();
      if (addUser) {
        cart.cart_userId = addUser._id
        await cart.save()

        // Create Permission for user when signup
        updatePermissionForUser(addUser)

        // send Otp to email of user
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
  },

  forgotPassword: async(email, urlOrigin) => {
    const user = await _User.findOne({ user_email: email });
    if (!user) {
      throw new AuthorizedFailError('User invalid!')
    }

    // send Otp to email of user
    const otp = createOtp();
    confirmMailer(
      email,
      user.user_name,
      otp,
      urlOrigin,
      user._id.toString(),
      () => {
        console.log("Send email successfully!");
      }
    )

    return {
      status: 201,
      message: "ok",
      data: {
        otp: await insertOtp(user_email, otp),
      }
    }
  },
});

const bcrypt = require("bcrypt");

const _User = require("../model/user.model.js");
const _Permission = require('../model/permission.model.js');

const { createToken, createRefreshToken } = require("../config/token");
const confirmMailer = require('../support/mails/confirmAccount');
const { getInfoUserGoogle } = require("../support/getInfoUserGoogle");
const { createOtp, insertOtp } = require('../util/otp.js');

var that = module.exports = {
  login: (email, password, res) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await _User.findOne({ email: email }).populate("cart.itemId");
        if (!user) {
          resolve({
            status: 402,
            message: "User is not exist",
          });
        } else if (user && user.role === "F1") {
          resolve({
            status: 302,
            message: "Please, Check email to confirm",
          });
        } else {
          const validPs = await bcrypt.compare(password, user.password);
          if (validPs) {
            const refresh_token = await createRefreshToken(user._id.toString());
            const access_token = await createToken(user._id.toString());
  
            res.cookie('access_token', access_token, {
              maxAge: 365 * 24 * 60 * 60 * 100,
              httpOnly: true,
              //secure: true;
            });
            res.cookie('refresh_token', refresh_token, {
              maxAge: 365 * 24 * 60 * 60 * 100,
              httpOnly: true,
              //secure: true;
            })
  
            resolve({
              status: 201,
              message: "ok",
              data: {
                username: user.username,
                email: user.email,
                cart: user.cart,
                gender: user?.gender,
              },
              token: {
                access_token,
                refresh_token
              }
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
  
  credential: async(value, origin, res) => {
    try{
      let user;
      if(origin === 'google') {
        user = await getInfoUserGoogle(value);
      }else {
       
        
      }
      if(user) {
        const userExist = await User.findOne({ email: user.emailAddresses[0].value }).populate("cart.itemId", '-password');
        if(userExist) {
          user = userExist
        }else {
          const newUser = new _User({
            email: user.emailAddresses[0].value,
            username: user.names[0].displayName,
            accountName : user.names[0].displayName,
            picture: {
              url: user.photos[0].url
            },
            role: 'F2',
          });
          user = await newUser.save();
        }
        if(user) {
  
          const refresh_token = await createRefreshToken(user._id.toString());
          const access_token = await createToken(user._id.toString());
  
          res.cookie('access_token', access_token, {
            maxAge: 365 * 24 * 60 * 60 * 100,
            httpOnly: true,
            //secure: true;
          });
          res.cookie('refresh_token', refresh_token, {
            maxAge: 365 * 24 * 60 * 60 * 100,
            httpOnly: true,
            //secure: true;
          })
          return {
            status: 201,
            message: 'ok',
            data: user,
            token: {
              access_token,
              refresh_token
            }
          }
        }
      }
    }catch(err) {
      return {
        status: 500,
        message: 'Error from server'
      }
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
  
            res.cookie('access_token', access_token, {
              maxAge: 365 * 24 * 60 * 60 * 100,
              httpOnly: true,
              //secure: true;
            });
            res.cookie('refresh_token', refresh_token, {
              maxAge: 365 * 24 * 60 * 60 * 100,
              httpOnly: true,
              //secure: true;
            })
  
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
  
  signup: (username, email, password, urlOrigin) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await _User.findOne({ email: email });
        if (!user) {
         
          const pw = await bcrypt.hash(password, 12);
          let newUser = new _User({
            username: username,
            email: email,
            password: pw,
          });
          const addUser = await newUser.save();
          if (addUser) {
            const permit = await _Permission.findById(addUser._id);
            
            if(!permit) {
              const addPermit = await _Permission.create({
                user: false,
                moderator: false,
                admin: false,
                guest: true,
                userId: addUser._id
              })
              if(addPermit) {
                await _User.findByIdAndUpdate(addUser._id, {
                  role: addPermit._id
                });
              }

              const otp = createOtp();
              confirmMailer(email, username, otp, urlOrigin, null, () => {
                console.log("Send email successfully");
              });
              resolve({
                status: 200,
                message: "ok",
                data: await insertOtp(
                  email,
                  otp
                )
              });
            }
          }
          resolve({
            status: 500,
            message: 'Error from server'
          })
        } else {
          resolve({
            status: 404,
            message: "Email already exist!",
          });
        }
      } catch (err) {
        reject(err);
      }
    });
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
          confirmMailer(email, user.username, null, urlOrigin, user._id.toString(), () => {
            console.log('Send email successfully!');
          });
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
            const users = await _User.find({ username: key }).select("-password");
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
  
  updateAvatar: async(picture, req) => {
    try{
      const user = await _User.findById(req.user._id).populate("cart.itemId");
      user.picture = picture;
      const updateUser = await user.save();
      return {
        status: 201,
        message: "ok",
        data: updateUser,
        token: createToken(updateUser._id),
      };
    }catch(err) {
      return {
        status: 500,
        message: 'Error from server'
      }
    }
  }

}


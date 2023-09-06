const User = require("../model/user");
const bcrypt = require("bcrypt");
const createToken = require("../config/token");
const sendMailer = require("../config/nodemailer");

exports.login = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        resolve({
          status: 402,
          message: "User is not exist",
        });
      } else {
        const validPs = await bcrypt.compare(password, user.password);
        if (validPs) {
          resolve({
            status: 200,
            message: "ok",
            data: {
              name: user.username,
              email: user.email,
            },
            token: createToken(user._id),
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
};

exports.signup = (username, email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.find({ email: email });
      if (!user.length) {
        const pw = await bcrypt.hash(password, 12);
        const newUser = new User({
          username,
          email,
          password: pw,
        });
        await newUser.save();
        sendMailer(email);
        resolve({
          status: 200,
          message: "ok",
        });
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
};

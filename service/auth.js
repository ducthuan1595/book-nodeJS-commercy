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
        const addUser = await newUser.save();
        if (addUser) {
          const token = createToken(addUser._id);
          sendMailer(email, username, token, () => {
            console.log("Send email successfully");
          });
          resolve({
            status: 200,
            message: "ok",
          });
        }
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

exports.confirm = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const addUser = await User.findById(id);
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
};

const User = require("../model/user");
const bcrypt = require("bcrypt");
const createToken = require("../config/token");
const sendMailer = require("../config/nodemailer");

exports.login = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user || user.role === "F1") {
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
              token: createToken(user._id),
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
};

exports.loginAdmin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user || user.role === "F1" || user.role === "F2") {
        resolve({
          status: 402,
          message: "Unauthorized",
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
              token: createToken(user._id),
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
          sendMailer(
            email,
            username,
            token,
            null,
            null,
            null,
            null,
            (isPw = false),
            () => {
              console.log("Send email successfully");
            }
          );
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

exports.forgotPassword = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        resolve({
          message: "User invalid",
        });
      } else {
        console.log("user", user._id);
        sendMailer(
          email,
          user.username,
          user._id,
          null,
          null,
          null,
          null,
          (isPw = true)
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
};

exports.confirmPassword = (password, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id);
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
};

exports.getUser = (page, limit, key, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role !== "F1") {
        if (key) {
          const users = await User.find({ username: key }).select("-password");
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
          const users = await User.find().select("-password");
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
};

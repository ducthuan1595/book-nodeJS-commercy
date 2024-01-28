const User = require("../model/user");
const bcrypt = require("bcrypt");
const createToken = require("../config/token");
const sendMailer = require("../config/nodemailer");
const confirmMailer = require('../suports/mails/confirmAccount');
const { getInfoUserGoogle } = require("../suports/getInfoUserGoogle");

exports.login = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: email }).populate("cart.itemId");
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
          resolve({
            status: 200,
            message: "ok",
            data: {
              username: user.username,
              email: user.email,
              cart: user.cart,
              gender: user?.gender,
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

exports.credential = async(token, origin) => {
  try{
    let user;
    if(origin === 'google') {
      user = await getInfoUserGoogle(token);
    }
    if(user) {
      const userExist = await User.findOne({ email: user.emailAddresses[0].value }).populate("cart.itemId");
      if(userExist) {
        user = userExist
      }else {
        const newUser = new User({
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
        return {
          status: 201,
          message: 'ok',
          data: user,
          token: createToken(user._id)
        }
      }
    }
  }catch(err) {
    return {
      status: 500,
      message: 'Error from server'
    }
  }
}

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

exports.signup = (username, email, password, urlOrigin) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        const pw = await bcrypt.hash(password, 12);
        const newUser = new User({
          username: username,
          email: email,
          password: pw,
        });
        const addUser = await newUser.save();
        if (addUser) {
          const token = createToken(addUser._id);
          confirmMailer(email, username, token, urlOrigin, null, () => {
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

exports.forgotPassword = (email, urlOrigin) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: email });
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

exports.updateUser = (account, fullname, phone, gender, address, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id).populate("cart.itemId");
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
};

exports.updateAvatar = async(picture, req) => {
  try{
    const user = await User.findById(req.user._id).populate("cart.itemId");
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

const voucher_codes = require("voucher-code-generator");
const Voucher = require("../model/voucher");
const User = require("../model/user");

exports.createVoucher = (expiration, quantity, discount, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role === "F3") {
        const code = voucher_codes.generate({
          length: 8,
          count: 1,
          prefix: "promo-",
        });
        // console.log(new Date().toLocaleString("vi-VI"));
        const newVoucher = new Voucher({
          code: code[0],
          expirationDate: new Date().getTime() + +expiration,
          discount: +discount,
          quantity: +quantity,
        });
        const addVoucher = await newVoucher.save();
        resolve({
          status: 200,
          message: "ok",
          data: addVoucher,
        });
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

exports.getVoucher = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        const vouchers = await Voucher.find();
        if (vouchers) {
          resolve({
            status: 200,
            message: "ok",
            data: vouchers,
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

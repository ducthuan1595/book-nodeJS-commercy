const voucher_codes = require("voucher-code-generator");
const Voucher = require("../model/voucher");
const User = require("../model/user");
const path = require("path");
const handleFile = require("../config/file");

const p = path.join("data", "images", "image");

exports.createVoucher = (expiration, quantity, discount, image, name, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role === "F3") {
        const code = voucher_codes.generate({
          length: 8,
          count: 1,
          prefix: name + "-",
        });
        let imageName;
        let pathname = Date.now() + image.name;
        imageName = "image" + pathname;
        image.mv(p + pathname, (err) => {
          if (err) {
            console.log("Error upload image");
          } else {
            console.log("Upload image successfully");
          }
        });
        // console.log(new Date().toLocaleString("vi-VI"));
        const newVoucher = new Voucher({
          code: code[0],
          expirationDate: +expiration,
          discount: +discount,
          quantity: +quantity,
          pic: imageName,
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

exports.getVoucher = (page, limit, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        const vouchers = await Voucher.find();
        for (let i = 0; i < vouchers.length; i++) {
          if (vouchers[i].expirationDate < Date.now()) {
            vouchers[i].isActive = false;
            await vouchers[i].save();
          }
        }
        const activeVoucher = vouchers.filter((v) => v.isActive === true);
        // page section
        const totalPage = Math.ceil(vouchers.length / limit);
        const start = (page - 1) * limit;
        const end = page * limit;
        const result = vouchers.slice(start, end);
        const totalNumber = vouchers.length;

        if (vouchers) {
          resolve({
            status: 200,
            message: "ok",
            data: {
              currPage: page,
              nextPage: page * limit < totalNumber,
              prevPage: 0 < page - 1,
              vouchers: result,
              totalPage: totalPage,
              totalVoucher: totalNumber,
              activeVoucher: activeVoucher.length,
            },
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

exports.deleteVoucher = (voucherId, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role === "F3") {
        const voucher = await Voucher.findByIdAndDelete(voucherId);
        if (voucher.pic) {
          const arrPic = [];
          arrPic.push(voucher.pic);
          handleFile.deleteFile(arrPic);
        }
        resolve({
          status: 201,
          message: "ok",
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

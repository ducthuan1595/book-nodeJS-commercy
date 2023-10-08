const voucher_codes = require("voucher-code-generator");
const Voucher = require("../model/voucher");
const User = require("../model/user");
const path = require("path");
const handleFile = require("../config/file");
const pageSection = require("../suports/pageSection");

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
        let imageName = await handleFile.handleSave(image);
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

exports.getVoucher = (page, limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      const vouchers = await Voucher.find();
      // page section
      if (page && limit) {
        const data = pageSection(page, limit, vouchers);

        if (vouchers) {
          resolve({
            status: 200,
            message: "ok",
            data: {
              currPage: page,
              nextPage: page * limit < vouchers.length,
              prevPage: 0 < page - 1,
              vouchers: data.result,
              totalPage: data.totalPage,
              totalVoucher: vouchers.length,
            },
          });
        }
      } else {
        resolve({
          status: 200,
          message: "ok",
          data: vouchers,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

// exports.deleteVoucher = (voucherId, req) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const user = await User.findById(req.user._id);
//       if (user && user.role === "F3") {
//         const voucher = await Voucher.findByIdAndDelete(voucherId);
//         if (voucher.pic) {
//           const arrPic = [];
//           arrPic.push(voucher.pic);
//           handleFile.deleteFile(arrPic);
//         }
//         resolve({
//           status: 201,
//           message: "ok",
//         });
//       } else {
//         resolve({
//           status: 403,
//           message: "Unauthorized",
//         });
//       }
//     } catch (err) {
//       reject(err);
//     }
//   });
// };

const User = require("../model/user");
const Item = require("../model/item");
const path = require("path");
const handleFile = require("../config/file");

const p = path.join("data", "images", "image");

exports.createItem = (value, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role === "F3") {
        const handleImage = (images) => {
          const imageName = [];
          images.forEach((img) => {
            const pathname = Date.now() + img.name;
            imageName.push("image" + pathname);
            img.mv(p + pathname, (err) => {
              if (err) {
                console.log("Error upload image");
              } else {
                console.log("Upload image successfully");
              }
            });
          });
          return imageName;
        };
        const pic = handleImage(value.imageArr);
        const detailPic = handleImage(value.detailPicArr);
        const item = new Item({
          name: value.name,
          priceInput: value.priceInput,
          pricePay: value.pricePay,
          categoryId: value.categoryId,
          slogan: value?.slogan,
          description: value.description,
          barcode: value.barcode,
          count: value.count,
          pic: pic,
          detailPic: detailPic,
          weight: value.weight,
        });
        const newItem = await item.save();
        if (newItem) {
          resolve({
            status: 200,
            message: "ok",
            data: newItem,
          });
        }
      } else {
        resolve({
          message: "Unauthorized",
          status: 402,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.updateItem = (value, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role === "F3") {
        const product = await Item.findById(value.itemId);
        if (product) {
          const handleImage = (images) => {
            const imageName = [];
            images.forEach((img) => {
              const pathname = Date.now() + img.name;
              imageName.push("image" + pathname);
              img.mv(p + pathname, (err) => {
                if (err) {
                  console.log("Error upload image");
                } else {
                  console.log("Upload image successfully");
                }
              });
            });
            return imageName;
          };
          const pic = handleImage(value.imageArr);
          const detailPic = handleImage(value.detailPicArr);
          product.name = value.name;
          product.priceInput = value.priceInput;
          product.pricePay = value.pricePay;
          product.categoryId = value.categoryId;
          product.slogan = value?.slogan;
          product.description = value.description;
          product.barcode = value.barcode;
          product.count = value.count;
          product.weight = value.weight;
          if (product.pic.length) {
            handleFile.deleteFile(product.pic, "images");
          }
          product.pic = pic;
          if (product.detailPic.length) {
            handleFile.deleteFile(product.detailPic, "images");
          }
          product.detailPic = detailPic;
          const newItem = await product.save();
          if (newItem) {
            resolve({
              status: 200,
              message: "ok",
              data: newItem,
            });
          }
        }
      } else {
        resolve({
          message: "Unauthorized",
          status: 402,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.deleteItem = (itemId, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        const item = await Item.findByIdAndDelete(itemId);
        if (item) {
          handleFile.deleteFile(item.pic, "images");
          handleFile.deleteFile(item.detailPic, "images");
          resolve({
            status: 200,
            message: "ok",
          });
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.getAllItem = (k) => {
  return new Promise(async (resolve, reject) => {
    try {
      const key = k
        ? {
            $or: [
              { name: { $regex: k, $options: "i" } },
              // { pricePay: { $regex: +k, $options: "i" } },
            ],
          }
        : {};
      const items = await Item.find(key);
      if (items) {
        resolve({
          status: 200,
          message: "ok",
          data: items,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

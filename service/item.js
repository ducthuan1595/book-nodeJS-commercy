const User = require("../model/user");
const Item = require("../model/item");
const Order = require("../model/order");
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
      if (user && user.role === "F3") {
        const orders = await Order.find().where("items.itemId", itemId);
        if (!orders) {
          const item = await Item.findByIdAndDelete(itemId);
          if (item) {
            handleFile.deleteFile(item.pic, "images");
            handleFile.deleteFile(item.detailPic, "images");
            resolve({
              status: 200,
              message: "ok",
            });
          } else {
            resolve({
              status: 404,
              message: "Item is not exist!",
            });
          }
        } else {
          resolve({
            status: 403,
            message: "Item used order!",
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

exports.getAllItem = (k, f, s, limit, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      // filter
      const itemFilter = await Item.find().populate({
        path: "categoryId",
        match: {
          name: f,
        },
      });

      const filters = itemFilter.filter((item) => item.categoryId !== null);
      // search
      const search = k
        ? filters.filter((item) => {
            if (item.name.includes(k)) {
              return item;
            }
          })
        : filters;

      // Sort
      const sort = s
        ? search.filter((item) => {
            if (+item.pricePay <= +s) {
              return item;
            }
          })
        : search;
      if (sort) {
        // page section
        const totalPage = Math.ceil(sort.length / limit);
        const start = (page - 1) * limit;
        const end = page * limit;
        const result = sort.slice(start, end);
        const totalNumber = sort.length;
        resolve({
          status: 200,
          message: "ok",
          data: {
            currPage: page,
            nextPage: page * limit < totalNumber,
            prevPage: 0 < page - 1,
            products: result,
            totalPage: totalPage,
          },
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

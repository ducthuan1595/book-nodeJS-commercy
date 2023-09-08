const User = require("../model/user");
const Item = require("../model/item");
const path = require("path");

const p = path.join("data", "images", "image");

exports.createItem = (value, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role === "F3") {
        const imageName = [];
        value.imageArr.forEach((img) => {
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
        const item = new Item({
          name: value.name,
          priceInput: value.priceInput,
          pricePay: value.pricePay,
          categoryId: value.categoryId,
          slogan: value?.slogan,
          description: value.description,
          barcode: value.barcode,
          count: value.count,
          pic: imageName,
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

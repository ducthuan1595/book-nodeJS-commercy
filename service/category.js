const Category = require("../model/category");
const User = require("../model/user");
const path = require("path");
const handleFile = require("../config/file");

const p = path.join("data", "banner", "image");

exports.getAllCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const categories = await Category.find();
      if (categories) {
        resolve({
          status: 200,
          message: "ok",
          data: categories,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.createCategory = (input, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role === "F3") {
        let imageName = [];
        input.images.forEach((img) => {
          let pathname = Date.now() + img.name;
          imageName.push("image" + pathname);
          img.mv(p + pathname, (err) => {
            if (err) {
              console.log("Error upload image");
            } else {
              console.log("Upload image successfully");
            }
          });
        });
        const category = new Category({
          name: input.name,
          banner: imageName,
          description: input?.description,
        });
        const newCategory = await category.save();
        resolve({
          status: 200,
          message: "ok",
          data: newCategory,
        });
      } else {
        resolve({
          status: 402,
          message: "Unauthorized!",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.updateCategory = (input, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role === "F3") {
        const category = await Category.findById(input.categoryId);
        let imageName = [];
        console.log(input.images);

        if (input.images) {
          input.images.forEach((img) => {
            let pathname = Date.now() + img.name;
            imageName.push("image" + pathname);
            img.mv(p + pathname, (err) => {
              if (err) {
                console.log("Error upload image");
              } else {
                console.log("Upload image successfully");
              }
            });
          });
        }
        if (category) {
          category.name = input.name;
          category.description = input?.description;
          if (category.banner.length) {
            handleFile.deleteFile(category.banner, "banner");
          }
          category.banner = imageName;
          const newCategory = await category.save();
          resolve({
            status: 200,
            message: "ok",
            data: newCategory,
          });
        } else {
          resolve({
            status: 404,
            message: "Not found category",
          });
        }
      } else {
        resolve({
          status: 402,
          message: "Unauthorized!",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.deleteCategory = (categoryId, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.role === "F3") {
        const category = await Category.findByIdAndDelete(categoryId);
        if (category) {
          resolve({
            status: 200,
            message: "ok",
          });
        } else {
          resolve({
            status: 404,
            message: "Not found category",
          });
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

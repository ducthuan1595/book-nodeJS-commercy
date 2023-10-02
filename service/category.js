const Category = require("../model/category");
const Item = require("../model/item");
const User = require("../model/user");
const path = require("path");
const handleFile = require("../config/file");
const pageSection = require("../suports/pageSection");

const p = path.join("data", "images", "image");

exports.getAllCategory = (page, limit, categoryId, type, column) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) {
          resolve({
            status: 404,
            message: "Not found",
          });
        } else {
          resolve({
            status: 201,
            message: "ok",
            data: category,
          });
        }
      } else if (!page && !limit && !categoryId) {
        const categories = await Category.find().sort([
          [column ? column : "position", type ? type : "asc"],
        ]);
        if (!categories) {
          resolve({
            status: 404,
            message: "Not found",
          });
        } else {
          resolve({
            status: 201,
            message: "ok",
            data: categories,
          });
        }
      } else {
        const categories = await Category.find();
        const data = pageSection(page, limit, categories);

        if (categories) {
          resolve({
            status: 200,
            message: "ok",
            data: {
              currPage: page,
              nextPage: page * limit < categories.length,
              prevPage: 0 < page - 1,
              categories: data.result,
              totalPage: data.totalPage,
              totalCategory: categories.length,
            },
          });
        }
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
          position: Number(input.position),
          active: input.isActive,
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
        if (input.images[0] !== undefined) {
          console.log("hello");
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
          category.position = input.position;
          category.active = input.isActive;
          if (imageName.length) {
            if (category.banner.length) {
              handleFile.deleteFile(category.banner);
            }
            category.banner = imageName;
          }
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
        const items = await Item.find({ categoryId: categoryId });
        if (items.length) {
          resolve({
            status: 302,
            message: "Category used to the product",
            data: items,
          });
        } else {
          const category = await Category.findByIdAndDelete(categoryId);
          if (category.banner.length) {
            handleFile.deleteFile(category.banner);
          }
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
        return;
      }
    } catch (err) {
      reject(err);
    }
  });
};

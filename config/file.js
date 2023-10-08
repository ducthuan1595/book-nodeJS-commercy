const fs = require("fs");
const path = require("path");
const process = require("node:process");
require("dotenv").config();

const p = path.join(process.env.FOLDER_IMAGE);
// const pp = path.join("data", "images", "image");

exports.deleteFile = (images) => {
  images.forEach((image) => {
    // const pathname = path.join(process.cwd(), "data", "images", image);
    const pathname = path.join(process.cwd(), `${p}/${image}`);
    fs.unlink(pathname, (err) => {
      if (err) {
        console.error(err);
        console.log("Delete failure");
      } else {
        console.log("Delete success");
      }
    });
  });
};

exports.sendImage = (req, res) => {
  const imageUrl = req.params.imageUrl;
  // const p1 = path.join(__dirname, "..", "data", "images", imageUrl);
  // const uploadPath = path.join(__dirname, "..", p, imageUrl);
  const uploadPath = path.join("/tmp", imageUrl);
  console.log(uploadPath);
  res.set("Content-Type", "image/png");
  res.sendFile(uploadPath);
};

exports.handleSave = async (images) => {
  if (Array.isArray(images)) {
    const imageName = [];
    images.forEach((img) => {
      const pathname = Date.now() + img.name;
      imageName.push("image" + pathname);
      const uploadPath = path.join(`${p}/image${pathname}`);
      img.mv(uploadPath, (err) => {
        if (err) {
          console.log("Error upload image");
        } else {
          console.log("Upload image successfully");
        }
      });
    });
    return imageName;
  } else {
    const imageName = [];
    const pathname = Date.now() + images.name;
    imageName.push("image" + pathname);
    const uploadPath = path.join(`${p}/image${pathname}`);
    img.mv(uploadPath, (err) => {
      if (err) {
        console.log("Error upload image");
      } else {
        console.log("Upload image successfully");
      }
    });
    return imageName;
  }
};

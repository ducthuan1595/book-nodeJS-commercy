const fs = require("fs");
const path = require("path");
const process = require("node:process");

exports.deleteFile = (images, name) => {
  images.forEach((image) => {
    const p = path.join(process.cwd(), "data", name, image);
    fs.unlink(p, (err) => {
      if (err) {
        console.log("Delete failure");
      } else {
        console.log("Delete success");
      }
    });
  });
};

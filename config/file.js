const fs = require("fs");
const path = require("path");
const process = require("node:process");

exports.deleteFile = (images) => {
  images.forEach((image) => {
    const p = path.join(process.cwd(), "data", "images", image);
    fs.unlink(p, (err) => {
      if (err) {
        console.log("Delete failure");
      } else {
        console.log("Delete success");
      }
    });
  });
};

exports.sendImage = (req, res) => {
  const imageUrl = req.params.imageUrl;
  const p = path.join(__dirname, "..", "data", "images", imageUrl);
  res.set("Content-Type", "image/png");
  res.sendFile(p);
};

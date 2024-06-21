const PDFDocument = require("pdfkit");
const fs = require("fs");
require("dotenv").config();

exports.handleSave = async (filename) => {
  const doc = new PDFDocument();
  let writeStream = fs.createWriteStream(
    `${process.env.FOLDER_IMAGE}/${filename}`
  );
  doc.pipe(writeStream);
  doc.text("image");
  doc.end();
};

exports.handleDelete = (images) => {
  images.forEach((image) => {
    const fileContent = fs.readFileSync(`${process.env.FOLDER_IMAGE}/${image}`);
    fs.unlink(fileContent, (err) => {
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
  const fileContent = fs.readFileSync(
    `${process.env.FOLDER_IMAGE}/${imageUrl}`
  );
  res.set("Content-Type", "image/png");
  res.sendFile(fileContent);
};

const cloudinary = require("../config/cloudinary");

exports.destroyCloudinary = async (publicId) => {
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    if (res.result === "ok") {
      console.log("Deleted image");
    }
  } catch (err) {
    console.error(err);
  }
};

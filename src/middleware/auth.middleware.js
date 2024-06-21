const jwt = require("jsonwebtoken");
const User = require("../model/user.model.js");
const {redisClient} = require('../dbs/init.redis')

const protect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const tokenId = req.headers.authorization.split(" ")[1];
      const token = await redisClient.get(tokenId);
      const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      console.error(err);
      res.status(403).json({ message: "Not authorized" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const verifyToken = async (tokenId) => {
  try {
    const token = await redisClient.get(tokenId);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_REFRESH_TOKEN);
    const user = await User.findById(decoded.id);
    return user._id;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { protect, verifyToken };

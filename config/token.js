const jwt = require("jsonwebtoken");
const { redisClient } = require('../dbs/init.redis');

async function createToken(id) {
  if (process.env.JWT_SECRET_TOKEN) {
    let time = '60'
    const tokenCounter = await redisClient.get('countBook');
    await redisClient.set("countBook", parseInt(tokenCounter) + 1);
    let key = (parseInt(tokenCounter) + 1).toString(); 

    const token = jwt.sign({id}, process.env.JWT_SECRET_TOKEN, {
      expiresIn: time + 's'
    })
    console.log(token, key, 'create token');
    // save token to redis store
    await redisClient.set(key, token);
    const expires = new Date().getTime() + parseInt(time) * 1000;
    return { key, expires };
  }
}

async function createRefreshToken (id) {
  if (process.env.JWT_SECRET_REFRESH_TOKEN) {
    const tokenCounter = await redisClient.get('countBook');
    await redisClient.set("countBook", parseInt(tokenCounter) + 1);
    let key = (parseInt(tokenCounter) + 1).toString(); 

    const token = jwt.sign({id}, process.env.JWT_SECRET_REFRESH_TOKEN, {
      expiresIn: '30d'
    })
    // save token to redis store
    await redisClient.set(key, token);
    return key;
  }
}

module.exports = {
  createToken,
  createRefreshToken,
}

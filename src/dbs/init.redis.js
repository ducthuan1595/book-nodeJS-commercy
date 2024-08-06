const redis = require('redis');
require("dotenv").config();

// const redisClient = redis.createClient();
const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD || '',
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379
    }
})
  
const initRedis = async() => {
    redisClient.on("error", (error) => console.error("Error redis " + error));
    await redisClient.connect();
}
  
module.exports = {
    redisClient,
    initRedis
};
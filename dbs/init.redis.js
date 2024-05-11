const redis = require('redis');

const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD || '',
    socket: {
        host: process.env.REDIS_HOST || '',
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 13616
    }
});
  
const initRedis = async() => {
    redisClient.on("error", (error) => console.error("Error redis" + error));
    await redisClient.connect();
}
  
module.exports = {
    redisClient,
    initRedis
};
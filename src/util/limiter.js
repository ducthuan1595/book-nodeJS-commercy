const { redisClient } = require('../dbs/init.redis');

const incr = key => {
    return new Promise(async(resolve, reject) => {
        const num = await redisClient.incr(key);
        resolve(num)
    })
}

const expired = (key, time) => {
    return new Promise(async(resolve, reject) => {
        const result = await redisClient.expire(key, time);
        resolve(result);
    })
}

const ttl = (key) => {
    return new Promise(async(resolve, reject) => {
        const result = await redisClient.ttl(key);
        resolve(result);
    })
}

module.exports = {
    incr,
    expired,
    ttl
}
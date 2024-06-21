const { expired, ttl, incr } = require('../util/limiter');

const limiterApi = async(req, res, next) => {
    const getIPUser = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const numRequest = await incr(getIPUser);
    let _ttl;
    if(numRequest === 1) {
        await expired(getIPUser, 60);
        _ttl = 60;
    }else {
        _ttl = await ttl(getIPUser);
    }

    if(numRequest > 10) {
        return res.status(503).json({
            code: 503,
            message: 'Server is busy',
            _ttl, numRequest
        })
    }

    next();
}

module.exports = limiterApi;
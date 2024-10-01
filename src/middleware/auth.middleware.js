const JWT = require("jsonwebtoken");
const _User = require("../model/user.model.js");
const _Key = require('../model/keytoken.model.js')
const {redisClient} = require('../dbs/init.redis');
const { AuthorizedFailError, NotFoundError } = require("../core/error.response.js")
const { HEADERS } = require('../config')
const { asyncHandler } = require('../support/asyncHandle.js')

const protect = asyncHandler( async (req, res, next) => {
  // check userId missing
  const userId = req.headers[HEADERS.CLIENT_ID]
  if(!userId) {
      throw new AuthorizedFailError('Invalid Request')
  }
  
  // get access token
  const keyStore = await _Key.findOne({key_token_userId: userId})
  
  if(!keyStore) {
      throw new NotFoundError('Not found user')
  }
  req.keyStore = keyStore

  // verify Token
  const refreshToken = req.headers[HEADERS.REFRESH_TOKEN]  
  if(refreshToken) {
    JWT.verify(refreshToken, keyStore.key_token_privateKey, function(err, decoded) {
      if(err) {
        throw new AuthorizedFailError(err)          
      }

      if(userId !== decoded.userId) throw new AuthorizedFailError('Invalid User')
      req.refreshToken = refreshToken
      req.user = decoded
    })
    return next()
  }
  
  const accessToken = req.headers[HEADERS.AUTHORIZATION]

  if(!accessToken) throw new AuthorizedFailError('Invalid Token')

  JWT.verify(accessToken, keyStore.key_token_publicKey, function(err, decoded) {
    if(err) {
      throw new AuthorizedFailError(err)          
    }
    if(userId !== decoded.userId) throw new AuthorizedFailError('Invalid userId')

    // save key store to request
    req.user = decoded
    return next()
  })  

})


module.exports = { protect };

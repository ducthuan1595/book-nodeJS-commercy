'use strict'

const _Key = require('../model/keytoken.model')

class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken, refreshTokenUsed = null}) => {
        try{
            const filter = {key_token_userId: userId}
            const update = {
                key_token_publicKey: publicKey,
                key_token_privateKey: privateKey,
                key_token_refreshToken: refreshToken,
                $addToSet: {
                    key_token_refreshTokenUsed: refreshTokenUsed
                }
            }
            const options = { upsert: true, new: true }

            const tokens = await _Key.findOneAndUpdate(filter, update, options)
            return tokens ? 1 : 0
        }catch(err) {
            throw err
        }
    }
}

module.exports = KeyTokenService

'use strict'

const JWT = require('jsonwebtoken')
const { HEADERS } = require('../config')

const createToken = async(payload, publicKey, privateKey) => {
    try{
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '2 days'
        })

        return {
            accessToken,
            refreshToken
        }
    }catch(err) {
        console.error(err);
    } 
}

const verifyJWT = (token, keySecret) => {
    return JWT.verify(token, keySecret)
}

module.exports = {
    createToken,
    verifyJWT
}
'use strict'

const crypto = require('node:crypto')
const _ApiKey = require('../model/apikey.model')

const createApiKey = async () => {
    const newKey = await _ApiKey.create({
        api_key: crypto.randomBytes(32).toString('hex'),
        api_key_permissions: ['0000']
    })
    console.log('ApiKey::', newKey);

    return newKey
}

module.exports = {
    createApiKey
}

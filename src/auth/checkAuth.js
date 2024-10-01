'use strict'

const { HEADERS } = require('../config')
const { ForbiddenError } = require('../core/error.response')
const _ApiKey = require('../model/apikey.model')

const apiKey = async (req, res, next) => {
    try{
        const key = req.headers[HEADERS.API_KEY]?.toString()
        if(!key) throw new ForbiddenError('Forbidden')
        const objKey = await _ApiKey.findOne({api_key: key})
        if(!objKey) throw new ForbiddenError('Forbidden Error api key')

        req.apiKey = objKey
        next()
    }catch(err) {
        console.log(err);
        next(err)
    }
}

const permission = (permission) => {
    return (req, res, next) => {        
        if(!req.apiKey.api_key_permissions) throw new ForbiddenError('Permission denied')

        const validPermission = req.apiKey.api_key_permissions.includes(permission)
        if(!validPermission) throw new ForbiddenError('Permission invalid')
        
        next()
    }
}

module.exports = {
    apiKey,
    permission
}
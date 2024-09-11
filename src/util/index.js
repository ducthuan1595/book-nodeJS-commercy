const { Types } = require('mongoose')
const _ = require('lodash')
const crypto = require('node:crypto')


const convertObjectIdMongoDb = id => {
    return new Types.ObjectId(id)
}

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}

const setCookies = (tokens, res) => {
    res.cookie("access_token", tokens.accessToken, {
        maxAge: 365 * 24 * 60 * 60 * 100,
        httpOnly: true,
        sameSite: "Lax",
        //secure: true;
      });
      res.cookie("refresh_token", tokens.refreshToken, {
        maxAge: 365 * 24 * 60 * 60 * 100,
        httpOnly: true,
        sameSite: "Lax",
        //secure: true;
      });
}

const publicKey = () => {
    return crypto.randomBytes(32).toString('hex')
}

const privateKey = () => {
    return crypto.randomBytes(32).toString('hex')
}

const getSelectData = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach(k => {
        if(obj[k] === null) {
            delete obj[k]
        }
    })
    return obj
}

const updateNestParser = obj => {
    const final = {}
    Object.keys(obj).forEach(k => {
        if(typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const res = updateNestParser(obj[k])
            Object.keys(res).forEach(a => {
                final[`${k}.${a}`] = res[a]
            })
        }else {
            final[k] = obj[k]
        }
    })
    return final
}

module.exports = {
    convertObjectIdMongoDb,
    getInfoData,
    setCookies,
    publicKey,
    privateKey,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestParser
}

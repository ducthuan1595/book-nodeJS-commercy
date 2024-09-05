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

module.exports = {
    convertObjectIdMongoDb,
    getInfoData,
    setCookies,
    publicKey,
    privateKey,
    getSelectData,
    unGetSelectData
}

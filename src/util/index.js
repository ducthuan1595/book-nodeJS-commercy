const { Types } = require('mongoose')
const _ = require('lodash')

const convertObjectIdMongoDb = id => {
    return new Types.ObjectId(id)
}

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}

module.exports = {
    convertObjectIdMongoDb,
    getInfoData
}

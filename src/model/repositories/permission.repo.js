'use strict'

const _Permission = require('../permission.model')
const { convertObjectIdMongoDb } = require('../../util')

const findByIdFromPermission = async(id) => {
    return await _Permission.findOne(convertObjectIdMongoDb(id))
}

const insertPermission = async({
    isUser = false,
    isModerator = false,
    isAdmin = false,
    isGuest = true,
    userId
}) => {
    return await _Permission.create({
        permit_user: isUser,
        permit_moderator: isModerator,
        permit_admin: isAdmin,
        permit_guest: isGuest,
        permit_userId: userId
    })
}

module.exports = {
    findByIdFromPermission,
    insertPermission
}

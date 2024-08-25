'use strict'

const _User = require('../user.model')
const { convertObjectIdMongoDb } = require('../../util')
const { insertPermission } = require('./permission.repo')

const findOneUserWithEmail = async({user_email}) => {    
    return await _User.findOne({user_email: user_email}).populate('user_cart.itemId')
}

const findByIdAndUpdateFromUser = async({userId, payload, isNew = true}) => {
    return await _User.findByIdAndUpdate(userId, payload, {new: isNew});
}

const updatePermissionForUser = async(user, payload) => {
    const permit = await insertPermission({ userId: user._id, ...payload})
        
    if (permit) {
        const updateRoleUser = await findByIdAndUpdateFromUser({userId: user._id, payload: {
            user_role: permit._id,
        }});
        
        return updateRoleUser ? 1 : 0
    }
}

module.exports = {
    findOneUserWithEmail,
    findByIdAndUpdateFromUser,
    updatePermissionForUser
}

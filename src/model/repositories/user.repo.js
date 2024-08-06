'use strict'

const _User = require('../user.model')
const { convertObjectIdMongoDb } = require('../../util')

const findOneUserWithEmail = async({user_email}) => {    
    return await _User.findOne({user_email: user_email}).populate('user_cart.itemId')
}

const findByIdAndUpdateFromUser = async({userId, payload, isNew = true}) => {
    return await _User.findByIdAndUpdate(userId, payload, {new: isNew});
}

module.exports = {
    findOneUserWithEmail,
    findByIdAndUpdateFromUser
}

'use strict'

const _User = require('../user.model')
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

async function findAllUser({limit, sort, page, filter}) {
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const users = await _User.aggregate([
        {
            $lookup: {
                from: 'permissions',
                localField: 'user_role',
                foreignField: '_id',
                as: 'user_role'
            }
        },
        {
            $unwind: {
                path: '$user_role',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: {
                [`user_role.${filter}`]: true
            }
        },
        {
            $project: {
                user_password: 0
            }
        },
        {
            $sort: sortBy
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        }
    ])

    return users;
}

module.exports = {
    findOneUserWithEmail,
    findByIdAndUpdateFromUser,
    updatePermissionForUser,
    findAllUser
}

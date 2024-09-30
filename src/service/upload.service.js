'use strict'

const cloudinaryConfig = require('../config/cloudinary')
const { format } = require('date-fns')

class UploadService {
    static uploadImage = async ({url, folder='product'}) => {
        const dateTime = `${format(new Date(), 'dd-MM-yyyy-cc-mm-ss')}`
        const folderName = 'timGiThe/' + folder
        const result = await cloudinaryConfig.uploader.upload(url, {
            folder: folderName,
            public_id: dateTime
        })

        return {url: result.url, public_id: result.public_id}
    }

    static removeImage = async ({public_id}) => {
        return await cloudinaryConfig.uploader.destroy(public_id)
    }
}

module.exports = UploadService
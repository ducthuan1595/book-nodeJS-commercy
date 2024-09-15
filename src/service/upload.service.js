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

    static removeAndUpdateImage = async (imgsRemove, imgsAdd) => {
        const images = []
        for(let img of imgsRemove) {
            await this.removeImage(img.public_id)
        }
        for(let url of imgsAdd) {
            const image = await this.uploadImage({url})
            images.push(image)
        }
        return images
    }
}

module.exports = UploadService
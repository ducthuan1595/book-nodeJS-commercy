'use strict'

const  { SuccessResponse } = require('../core/success.response')
const { uploadImage } =  require('../service/upload.service')

class UploadController {
  uploadImage = async (req, res) => {
    new SuccessResponse({
      message: 'ok',
      metadata: await uploadImage(req.body)
    })
  }
}

module.exports = new UploadController()
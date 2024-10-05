'use strict'

const  { SuccessResponse } = require('../core/success.response')
const { uploadImage } =  require('../service/upload.service')

class UploadController {
  /**
   * 
   * @param {body: {image}} req 
   * @param {message: 'Upload image success', metadata: await uploadImage(req.body)} res 
   */ 
  uploadImage = async (req, res) => {
    new SuccessResponse({
      message: 'ok',
      metadata: await uploadImage(req.body)
    })
  }
}

module.exports = new UploadController()
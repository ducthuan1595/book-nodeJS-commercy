const Joi = require('joi')

const createItemValidate = data => {
    const itemSchema = Joi.object({
        product_name: Joi.string().required(),
        product_thumb: Joi.array().required(),
        product_description: Joi.string().required(),
        product_slogan: Joi.string(),
        product_price: Joi.object({
            origin: Joi.number().required(),
            sale: Joi.number()
        }),
        product_quantity: Joi.number().required(),
        product_attributes: Joi.string(),
        product_type: Joi.string().required(),
    })
    return itemSchema.validate(data)
}


module.exports = {
    createItemValidate
}
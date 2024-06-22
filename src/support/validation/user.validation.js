const Joi = require('joi');

const signUpValidate = data => {
    const userSchema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(6).max(32).required(),
        username: Joi.string().min(2).required()
    });

    return userSchema.validate(data);
}

const loginValidate = data => {
    const userSchema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(6).max(32).required(),
    });

    return userSchema.validate(data);
}

module.exports = {
    signUpValidate,
    loginValidate
}
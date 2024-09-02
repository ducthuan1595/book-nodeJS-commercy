const Joi = require('joi');

const signUpValidate = data => {
    const userSchema = Joi.object({
        user_email: Joi.string().email().lowercase().required(),
        user_password: Joi.string().min(6).max(32).required(),
        user_name: Joi.string().min(2).required()
    });

    return userSchema.validate(data);
}

const loginValidate = data => {
    const userSchema = Joi.object({
        user_email: Joi.string().email().lowercase().required(),
        user_password: Joi.string().min(6).max(32).required(),
    });

    return userSchema.validate(data);
}

const emailValidate = email => {
    const emailSchema = Joi.object({
        email: Joi.string().email().required()
    })

    return emailSchema.validate(email)
}

const pwValidate = pw => {
    const pwSchema = Joi.object({
        password: Joi.string().min(6).required()
    })

    return pwSchema.validate(pw)
}

const updateUserValidate = user => {
    const userSchema = Joi.object({
        user_gender: Joi.string(),
        user_name: Joi.string(),
        user_account: Joi.string(),
        user_address: Joi.string()
    })
    return userSchema.validate(user)
}

module.exports = {
    signUpValidate,
    loginValidate,
    emailValidate,
    pwValidate,
    updateUserValidate
}
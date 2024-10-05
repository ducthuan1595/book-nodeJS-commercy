const authService = require("../service/auth.service");
const { SuccessResponse } = require("../core/success.response");
const { ErrorResponse, BadRequestError } = require("../core/error.response");
const { verifyToken } = require("../middleware/auth.middleware");
const {
  loginValidate,
  signUpValidate,
  emailValidate
} = require("../support/validation/user.validation");
require("dotenv").config();

class AccessController {
  /**
   * 
   * @param {body: {email, password}} req 
   * @param {message: 'Login success', metadata: await authService.login({...req.body, res})} res 
   */
  login = async (req, res) => {
    const { error } = loginValidate(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    } else {
      const data = await authService.login({ ...req.body, res });
      new SuccessResponse({
        message: data.message,
        metadata: data.data,
      }).send(res);
    }
  };

  /**
   * 
   * @param {query: {value, origin}} req 
   * @param {message: 'Credential success', metadata: await authService.credential(value, origin, res)} res 
   */
  credential = async (req, res) => {
    const { value, origin } = req.query;
    if (!value || !origin) {
      throw new BadRequestError("Query not found");
    }
    const data = await authService.credential(value, origin, res);
    new SuccessResponse({
      message: data.message,
      metadata: data.data,
    }).send(res);
  };

  /**
   * 
   * @param {body: {email, password}} req 
   * @param {message: 'Signup success', metadata: await authService.signup({...req.body, urlOrigin})} res 
   */
  signup = async (req, res) => {
    const urlOrigin = req.protocol + "://" + req.get("host");
    const { error } = signUpValidate(req.body)

    if (error) {
      throw new ErrorResponse(error.details[0].message)
    } else {
      const data = await authService.signup({ ...req.body, urlOrigin })
      new SuccessResponse({
        message: data.message,
        metadata: data.data,
      }).send(res);
    }
  };
  
  /**
   * 
   * @param {body: {email}} req 
   * @param {message: 'Forgot password success', metadata: await authService.forgotPassword(email, urlOrigin)} res 
   */
  forgotPassword = async (req, res) => {
    const { email } = req.body
    const urlOrigin = req.protocol + "://" + req.get("host")
    const {error} = emailValidate(req.body)
    if (error) {
      throw new ErrorResponse(error.details[0].message)
    }

    const data = await authService.forgotPassword(email, urlOrigin)
    new SuccessResponse({
      message: data.message,
      metadata: data.data,
    }).send(res);
  };
}

module.exports = new AccessController();

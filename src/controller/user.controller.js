const userService = require("../service/user.service");
const { SuccessResponse } = require("../core/success.response");
const { ErrorResponse, BadRequestError, NotFoundError } = require("../core/error.response");
const { pwValidate, updateUserValidate } = require("../support/validation/user.validation");
require("dotenv").config();

class UserController {

  getUser = async (req, res) => {
    const page = req.query?.page === "null" ? 1 : req.query.page;
    const limit = req.query?.limit === "null" ? 10 : req.query.limit;
    const key = req.query?.key === "null" ? null : req.query.key;
    const data = await userService.getUser(page, limit, key, req);
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  };

  updateUser = async (req, res) => {
    const { user_account, user_name, user_gender, user_address } = req.body;
    const {error} = updateUserValidate(req.body)
    if(error) {
      throw new NotFoundError(error.details[0].message)
    }
    const data = await userService.updateUser({
      user_account,
      user_name,
      user_gender,
      user_address,
      user: req.user
    })

    new SuccessResponse({
      message: data.message,
      metadata: data.data
    }).send(res)
  };

  updateAvatar = async (req, res) => {
    const picture = req.body;
    if (!picture) {
      throw new NotFoundError('Not found image')
    }
    const data = await userService.updateAvatar(picture, req.user.userId);
    new SuccessResponse({
      message: data.message,
      metadata: data.data
    }).send(res)
  }

  changePassword = async (req, res) => {
    const { password } = req.body;
    const {error} = pwValidate(req.body)
    if (error) {
      throw new NotFoundError(error.details[0].message)
    }
    const data = await userService.changePassword(password, req.user)
    new SuccessResponse({
      message: data.message,
      metadata: data.data
    }).send(res)
  };

  refreshToken = async (req, res) => {
    const { keyStore, user, refreshToken } = req
    if(!keyStore || !user) {
      throw new ErrorResponse('Invalid refresh token')
    }

    const data = await userService.handleRefreshToken(user, keyStore, refreshToken, res)
    new SuccessResponse({
      message: data.message,
      metadata: data.data
    }).send(res)
  };
}

module.exports = new UserController();

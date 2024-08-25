const userService = require("../service/user.service");
const { SuccessResponse } = require("../core/success.response");
const { ErrorResponse, BadRequestError, NotFoundError } = require("../core/error.response");
const { pwValidate } = require("../support/validation/user.validation");
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
    const { accountName, fullname, phone, gender, address } = req.body;
    const data = await userService.updateUser(
      accountName,
      fullname,
      phone,
      gender,
      address,
      req
    );
    if (data) {
      res
        .status(data.status)
        .json({ message: data.message, data: data?.data, token: data?.token });
    }
  };

  updateAvatar = async (req, res) => {
    try {
      const picture = req.body;
      if (!picture) {
        return res.status(400).json({ message: "Not found" });
      }
      const data = await userService.updateAvatar(picture, req);
      if (data) {
        return res
          .status(data.status)
          .json({ message: data.message, data: data.data, token: data.token });
      }
    } catch (err) {
      return res.status(500).json({ message: "Error from server" });
    }
  };

  changePassword = async (req, res) => {
    const { password } = req.body;
    const {error} = pwValidate(req.body)
    if (error) {
      throw new NotFoundError('Password Invalid!')
    }
    const data = await userService.changePassword(password, req)
    new SuccessResponse({
      message: data.message,
      metadata: data.data
    }).send(res)
  };

  refreshToken = async (req, res) => {
    const { keyStore, user } = req
    if(!keyStore || !user) {
      throw new ErrorResponse('Invalid refresh token')
    }

    const data = await userService.handleRefreshToken(user, keyStore, refresh_token)
    new SuccessResponse({
      message: data.message,
      metadata: data.data
    }).send(res)
  };
}

module.exports = new UserController();

const authService = require("../service/auth.service");
const { SuccessResponse } = require('../core/success.response')
const { ErrorResponse, BadRequestError } = require('../core/error.response')
const {verifyToken} = require("../middleware/auth.middleware");
const {createRefreshToken, createToken} = require('../config/token');
const { loginValidate, signUpValidate } = require('../support/validation/user.validation');
require("dotenv").config();

class UserController {
  login = async (req, res) => {
      const { error } = loginValidate(req.body);
      if (error) {
        throw new BadRequestError(error.details[0].message)
      } else {
        const data = await authService.login({...req.body, res});
        new SuccessResponse({
          message: data.message,
          metadata: data.data
        }).send(res)
      }
  };
  
  credential = async(req, res) => {
    try{
      const {value, origin} = req.query;
      if(!value || !origin) {
        return res.status(401).json({message: 'Not found'})
      }
      const data = await authService.credential(value, origin, res);
      if(data) {
        return res.status(data.status).json({message: data.message, data: data.data, token: data.token})
      }
    }catch(err) {
      return res.status(500).json({message: 'Error from server'})
    }
  }
  
  loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    const { error } = loginValidate(req.body);
    if (error) {
      res.status(403).json({ message: error.details[0].message });
    } else {
      const data = await authService.loginAdmin(email, password);
      if (data) {
        res
          .status(data.status)
          .json({ message: data?.message, data: data?.data });
      }
    }
  };
  
  signup = async (req, res) => {
      const urlOrigin = req.protocol + "://" + req.get("host");
      const { error } = signUpValidate(req.body);
      if (error) {
        throw new ErrorResponse(error.details[0].message)
      } else {        
        const data = await authService.signup({...req.body, urlOrigin});
        new SuccessResponse({
          message: data.message,
          metadata: data.data
        }).send(res)
      }
  };
  
  refreshToken = async(req, res) => {
    const {refresh_token} = req.body;
    if(refresh_token) {
      const user_id = await verifyToken(refresh_token);
      if(user_id) {
        const refresh_token = await createRefreshToken(user_id.toString());
        const access_token = await createToken(user_id.toString());
  
        res.status(200).json({message: 'ok', data: {
          access_token,
          refresh_token
        }})
      }
    }
  }
  
  confirm = async (req, res) => {
    const token = req.query?.token;
    const id = await authMiddleware.verifyToken(token);
    if (id) {
      const data = await authService.confirm(id);
      if (data) {
        res.status(data.status).render("confirm", {
          path: "/confirm",
          pageTitle: "Confirm",
        });
      }
    } else {
      res.status(404).json({ message: "User is invalid!" });
    }
  };
  
  forgotPassword = async (req, res) => {
    const { email } = req.body;
    const urlOrigin = req.protocol + "://" + req.get("host");
    if (!email) {
      res.status(404).json({ message: "Not found" });
    } else {
      const data = await authService.forgotPassword(email, urlOrigin);
      if (data) {
        res.status(data.status).json({ message: data.message, data: data?.data });
      }
    }
  };
  
  confirmPassword = async (req, res) => {
    const { password, user_id } = req.body;
    if (!password || !user_id) {
      res.status(404).json({ message: "Password invalid" });
    } else {
      const data = await authService.confirmPassword(password, user_id);
      if (data) {
        res
          .status(data.status)
          .redirect(
            data.data.role === "F3"
              ? process.env.CLIENT_ADMIN_1_REDIRECT
              : process.env.CLIENT_1_REDIRECT + '/login'
          );
      }
    }
  };
  
  getUser = async (req, res) => {
    const page = req.query?.page === "null" ? 1 : req.query.page;
    const limit = req.query?.limit === "null" ? 10 : req.query.limit;
    const key = req.query?.key === "null" ? null : req.query.key;
    const data = await authService.getUser(page, limit, key, req);
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  };
  
  updateUser = async (req, res) => {
    const { accountName, fullname, phone, gender, address } = req.body;
    const data = await authService.updateUser(
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
  
  updateAvatar = async(req, res) => {
    try{
      const picture = req.body;
      if(!picture) {
        return res.status(400).json({message: 'Not found'})
      }
      const data = await authService.updateAvatar(picture, req);
      if(data) {
        return res.status(data.status).json({message: data.message, data: data.data, token: data.token})
      }
    }catch(err) {
      return res.status(500).json({message: 'Error from server'})
    }
  }

}

module.exports = new UserController()

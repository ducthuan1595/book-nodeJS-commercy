const authService = require("../service/auth");
const authMiddleware = require("../middleware/auth");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    res.status(403).json({ message: "You are not authentication" });
  } else {
    const data = await authService.login(email, password);
    if (data) {
      res
        .status(data.status)
        .json({ message: data?.message, data: data?.data, token: data?.token });
    }
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    res.status(403).json({ message: "You are not authentication" });
  } else {
    const data = await authService.loginAdmin(email, password);
    if (data) {
      res
        .status(data.status)
        .json({ message: data?.message, data: data?.data });
    }
  }
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username && !email && !password) {
    res.status(404).json({ message: "Input invalid!" });
  } else {
    const data = await authService.signup(username, email, password);
    if (data) {
      res
        .status(data.status)
        .json({ message: data?.message, data: data?.data, token: data?.token });
    }
  }
};

exports.confirm = async (req, res) => {
  const token = req?.query.token;
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

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(404).json({ message: "Not found" });
  } else {
    const data = await authService.forgotPassword(email);
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  }
};

exports.confirmPassword = async (req, res) => {
  const { password, user_id } = req.body;
  if (!password || !user_id) {
    res.status(404).json({ message: "Password invalid" });
  } else {
    const data = await authService.confirmPassword(password, user_id);
    if (data) {
      res
        .status(data.status)
        .redirect(
          data.data.role === "F2"
            ? "http://localhost:3000/login"
            : "http://localhost:3001/login"
        );
    }
  }
};

exports.getUser = async (req, res) => {
  const page = req.query?.page === "null" ? 1 : req.query.page;
  const limit = req.query?.limit === "null" ? 10 : req.query.limit;
  const key = req.query?.key === "null" ? null : req.query.key;
  const data = await authService.getUser(page, limit, key, req);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};

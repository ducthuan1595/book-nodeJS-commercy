const authService = require("../service/auth");

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

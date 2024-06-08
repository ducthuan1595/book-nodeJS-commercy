const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.ADDRESS_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const HTMLContent = (name, token, urlOrigin, userId) => {
  if (userId) {
    return `
    <html>
      <h1>Xin chào! ${name} đây là email dùng để lấy lại mật khẩu</h1>
      <div style="margin: 20px 0;">Làm ơn! đừng chia sẽ điều này cho bất kỳ ai để tránh rũi ro!</div>
      <form method="POST" action="${urlOrigin}/confirm-password">
      <div>Please, reset your password here!</div>

      <div>
      <label>New Password</label><br>
        <input type='password' name="password" /><br>
        <input type='hidden' name="user_id" value="${userId}" /><br>
      </div>
      <div><button type="submit" style="cursor:'pointer'" >Lấy lại mật khẩu</button></div>
      </form>
    </html>
  `;
  } else {
    return `
    <html>
      <h1>Xin chào! ${name} vui lòng xác thực tài khoản với email đã đăng ký</h1>
      <div>Xác thực tài khoản bằng cách click vào đường link bên dưới!</div>
      <div><a style="font-size: 18px;" href="${urlOrigin}/confirm?token=${token}" >Confirm</a></div>
    </html>
  `;
  }
};

const sendMailer = async (
  email,
  name,
  token,
  urlOrigin,
  userId
) => {
  try {
    const options = await transporter.sendMail({
      from: '"Tìm Gì Thế - Book📚" <foo@example.com>', // sender address
      to: email,
      subject: userId ? "Lấy lại mật khẩu" : "Xác thực tài khoản",
      text: "Xin chào!" + name,
      html: HTMLContent(name, token, urlOrigin, userId),
    });
    await transporter.sendMail(options);
  } catch (err) {
    console.error(err);
  }
};

module.exports = sendMailer;


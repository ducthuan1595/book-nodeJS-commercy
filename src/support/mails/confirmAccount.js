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

const HTMLContent = (name, otp, urlOrigin, userId) => {
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
      <h1>Hello! ${name}</h1>
      <div>You just registed a account at TimGiThe</div>
      <div>The Below is the OTP code you need to must confirm. It'll expire in 5 minutes</div>
      <div style="text-align:'center';">
        <span style="border: 1px solid blue; border-radius: 8px; padding: 2px 6px; margin: 10px auto;">${otp}</span>
      </div>
    </html>
  `;
  }
};

const sendMailer = async (
  email,
  name,
  otp,
  urlOrigin,
  userId
) => {
  try {
    const options = await transporter.sendMail({
      from: '"Tìm Gì Thế - Book📚" <foo@example.com>', // sender address
      to: email,
      subject: userId ? "Lấy lại mật khẩu" : "Confirm account",
      text: "Hi!" + name,
      html: HTMLContent(name, otp, urlOrigin, userId),
    });
    await transporter.sendMail(options);
  } catch (err) {
    console.error(err);
  }
};

module.exports = sendMailer;


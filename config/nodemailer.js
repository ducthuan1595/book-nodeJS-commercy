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

const HTMLContent = (name, token) => `
  <html>
    <h1>Hello ${name}</h1>
    <div>Please, confirm you already resgister!</div>
    <div><a href="http://localhost:5050/confirm?token=${token}" >Confirm</a></div>
  </html>
`;

// async..await is not allowed in global scope, must use a wrapper
const sendMailer = async (email, name, token) => {
  try {
    const options = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: email, // list of receivers
      subject: "Confirm email ✔", // Subject line
      text: "Hello" + name, // plain text body
      html: HTMLContent(name, token), // html body
    });
    await transporter.sendMail(options);
  } catch (err) {
    console.error(err);
  }
};

module.exports = sendMailer;

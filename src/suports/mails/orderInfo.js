const nodemailer = require("nodemailer");
require("dotenv").config();
const Item = require("../../model/item");

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

const HTMLOrder = (items, start, name, quantity, amount) => `<html>
<head>
<style>

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
table {
  border-collapse: collapse;
  width: 100%;
}

.bold {
  font-size: 20px;
  font-weight: 700;
  margin: 10px 0;
}
.info {
  margin: 5px 0;
}
</style>
</head>
<body>
  <h2>Hi, ${name}</h2>
  <div>You ordered at our shop at ${new Date(start)}</div>
  <div>Sum number: ${quantity}</div>
  <div>Amount: ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ</div>
<div>Detail info</div>
  <table>
  <tr>
    <th>Product's Name</th>
    <th>Image</th>
    <th>Price</th>
  </tr>
    ${items
      .map((p) => {
        const item = p;
        const originPrice = item.pricePay
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return `
        <tr>
          <td>${item.name}</td>
          <td><img style="height:100px;" src='${item.pic[0].url}' alt=${item.name} /></td>
          <td>${originPrice}đ</td>
        </tr>
      `;
      })
      .join("")}
</table>

  <div>
    <div>We'll effort deliver orders as soon as. Please, attention your phone when servicer arrived!</div>
    <div>Thanks, We are very happy when to service you!</div>
  </div>
</body>
</html>`;

const sendMailer = async (email, name,arrItemId, start, quantity, amount ) => {
  try {
    const items = await Item.find().where("_id", arrItemId);
    const options = await transporter.sendMail({
      from: '"Tìm Gì Thế - Book📚" <foo@example.com>', // sender address
      to: email,
      subject: "Đặt hàng thành công",
      text: "Xin chào!" + name,
      html: HTMLOrder(items, start, name, quantity, amount),
    });
    await transporter.sendMail(options);
  } catch (err) {
    console.error(err);
  }
};

module.exports = sendMailer;

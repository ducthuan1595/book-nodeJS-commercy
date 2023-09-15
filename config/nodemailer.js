const nodemailer = require("nodemailer");
require("dotenv").config();

const Item = require("../model/item");

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

const HTMLSale = (items, name, start, end, percent) => `<html>
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
  <div>We have a promotion programming up to ${percent}% begin ${new Date(
  start
)} to ${new Date(end)}</div>
  <table>
  <tr>
    <th>Product's Name</th>
    <th>Image</th>
    <th>Origin Price</th>
    <th>Sale Price</th>
  </tr>
    ${items
      .map((p) => {
        const item = p._doc;
        const originPrice = item?.priceInput
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        const salePrice = item?.pricePay
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return `
        <tr>
          <td>${item.name}</td>
          <td><img style="height:100px;" src='cid:${item.pic[0]}' alt=${item.name} /></td>
          <td>${originPrice}$</td>
          <td>${salePrice}$</td>
        </tr>
      `;
      })
      .join("")}
</table>
  <div>Limit quantity! Hurry up</div>
  <div><a href="#">Visit website</a></div>
</body>
</html>`;

// async..await is not allowed in global scope, must use a wrapper
const sendMailer = async (
  email,
  name,
  token,
  arrItemId,
  start,
  end,
  percent
) => {
  try {
    // sale
    const items = await Item.find().where("_id", arrItemId);
    const options = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: email, // list of receivers
      subject: !arrItemId.length ? "Confirm email ✔" : "Flash sale", // Subject line
      text: "Hello" + name, // plain text body
      html: !arrItemId.length
        ? HTMLContent(name, token)
        : HTMLSale(items, name, start, end, percent), // html body
    });
    await transporter.sendMail(options);
  } catch (err) {
    console.error(err);
  }
};

module.exports = sendMailer;

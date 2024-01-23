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

const HTMLContent = (name, token, isPw) => {
  if (isPw) {
    return `
    <html>
      <h1>Hello ${name}</h1>
      <form method="POST" action="http://localhost:5050/confirm-password">
      <div>Please, reset your password here!</div>

      <div>
      <label>Password</label><br>
        <input type='password' name="password" /><br>
        <input type='hidden' name="user_id" value="${token}" /><br>
      </div>
      <div><button type="submit" style="cursor:'pointer'" >Confirm</button></div>
      </form>
    </html>
  `;
  } else {
    return `
    <html>
      <h1>Hello ${name}</h1>
      <div>Please, confirm you already resgister!</div>
      <div><a href="http://localhost:5050/confirm?token=${token}" >Confirm</a></div>
    </html>
  `;
  }
};

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
        const originPrice = item?.priceInput
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return `
        <tr>
          <td>${item.name}</td>
          <td><img style="height:100px;" src='cid:${item.pic[0]}' alt=${item.name} /></td>
          <td>${originPrice}đ</td>
        </tr>
      `;
      })
      .join("")}
</table>

  <div>Thanks, We are very happy when to service you!</div>
</body>
</html>`;

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
        const item = p;
        const originPrice = item?.priceInput
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        const salePrice = item?.pricePay
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return `
        <tr>
          <td>${item.name}</td>
          <td><img style="height:100px;" src='${item.pic[0].url}' alt=${item.name} /></td>
          <td>${originPrice}đ</td>
          <td>${salePrice}đ</td>
        </tr>
      `;
      })
      .join("")}
</table>
  <div>Limit quantity! Hurry up</div>
  <div><a href="http://localhost:3000">Visit website</a></div>
</body>
</html>`;

const handleShowHTML = (
  arrItemId,
  name,
  token,
  items,
  start,
  end,
  percent,
  isPw,
  isOrder,
  quantity,
  amount
) => {
  if (arrItemId && !isOrder) {
    return HTMLSale(items, name, start, end, percent); // html body
  } else if (isOrder && !isPw) {
    return HTMLOrder(items, start, name, quantity, amount);
  } else {
    return HTMLContent(name, token, isPw);
  }
};

// async..await is not allowed in global scope, must use a wrapper
const sendMailer = async (
  email,
  name,
  token,
  arrItemId,
  start,
  end,
  percent,
  isPw,
  isOrder,
  quantity,
  amount
) => {
  try {
    // sale
    const items = await Item.find().where("_id", arrItemId);
    const options = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: email, // list of receivers
      subject: !arrItemId ? "Confirm email ✔" : "Flash sale", // Subject line
      text: "Hello" + name, // plain text body
      html: handleShowHTML(
        arrItemId,
        name,
        token,
        items,
        start,
        end,
        percent,
        isPw,
        isOrder,
        quantity,
        amount
      ),
    });
    await transporter.sendMail(options);
  } catch (err) {
    console.error(err);
  }
};

module.exports = sendMailer;

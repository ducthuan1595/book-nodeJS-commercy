const cron = require("node-cron");

const sendMailer = require("../config/nodemailer");
const User = require("../model/user");
const Item = require("../model/item");

const handleItem = async (arr, id, discountPercent, saleId) => {
  const item = arr.find((item) => {
    return item._id.toString() === id.toString();
  });
  item.pricePay = Math.floor(
    item.priceInput - (item.priceInput * discountPercent) / 100
  );
  item.flashSaleId = saleId;
  console.log({ item });
  await item.save();
};
const scheduleSale = (start, end, percent, saleId, value, arrItemId) => {
  const before15 = 15 * 60 * 1000;
  const time = start - before15;
  const day = new Date(time);
  const getSecond = day.getSeconds();
  const getMinute = day.getMinutes();
  const getHour = day.getHours() + 7;
  const getDay = day.getDate();
  const getMonth = day.getMonth() + 1;
  const daysOfWeek = [0, 2, 3, 4, 5, 6, 7];
  const getWeek = daysOfWeek[day.getDay()];
  const timeString = `* ${getMinute} ${getHour} ${getDay} * *`;
  // const timeString = `* * * * * *`;

  const cronSchedules = cron.schedule(timeString, async () => {
    const users = await User.find().select("email");
    const emails = users.map((u) => u.email);
    if (start > Date.now() && end > start) {
      const items = await Item.find();

      // await value.items.map((item) => {
      //   // console.log("id", item.itemId);
      //   return handleItem(items, item.itemId);
      // });
      for (const item of value.items) {
        handleItem(items, item.itemId, +value.discountPercent, saleId);
      }

      if (users) {
        sendMailer(
          emails,
          "you",
          "",
          arrItemId,
          start,
          end,
          percent,
          (isPw = false),
          (isOrder = false),
          null,
          null
        );
      }
    }

    cronSchedules.stop();
  });
};

module.exports = scheduleSale;

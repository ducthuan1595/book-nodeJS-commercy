const cron = require("node-cron");

const sendMailer = require("../suports/mails/saleInfo");
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
  await item.save();
};
const scheduleSale = (start, end, percent, saleId, value, arrItemId) => {
  const before15 = 15 * 60 * 1000;

  const time = start - before15 > Date.now() ? start - before15 : Date.now();
  const day = new Date(time);
  // const day = new Date();
  const getMinute = day.getMinutes();
  const getHour = day.getHours();
  const getDay = day.getDate();
  const getMonth = day.getMonth() + 1;
  const daysOfWeek = [0, 2, 3, 4, 5, 6, 7];
  const getWeek = daysOfWeek[day.getDay()];
  const timeString = `* ${getMinute} ${getHour} ${getDay} ${getMonth} *`;
  console.log(timeString);
  // console.log({ timeString });

  const cronSchedules = cron.schedule(timeString, async () => {
    const users = await User.find().select("email");
    const emails = users.map((u) => u.email);
    if (end > start) {
      const items = await Item.find();
      for (const item of value.items) {
        handleItem(items, item.itemId, +value.discountPercent, saleId);
      }

      console.log({ users });
      if (users.length) {
        sendMailer(
          emails,
          "you",
          arrItemId,
          start,
          end,
          percent,
        );
      }
    }

    cronSchedules.stop();
  });
};

module.exports = scheduleSale;

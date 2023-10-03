const cron = require("node-cron");

const sendMailer = require("../config/nodemailer");
const User = require("../model/user");
const Item = require("../model/item");

const scheduleSale = (start, end, percent, saleId, value, arrItemId) => {
  const before15 = 15 * 60 * 1000;
  const time = start - before15;
  const day = new Date();
  console.log(day.getHours());
  const getSecond = day.getSeconds();
  const getMinute = day.getMinutes() + 1;
  const getHour = day.getHours();
  const getDay = day.getDate();
  const getMonth = day.getMonth() + 1;
  const daysOfWeek = [0, 2, 3, 4, 5, 6, 7];
  const getWeek = daysOfWeek[day.getDay()];
  // const timeString = `* ${getMinute} ${getHour} ${getDay} ${getMonth} *`;
  const timeString = "* 34 1 30 09 *";
  console.log({ timeString });
  const cronSchedules = cron.schedule(timeString, async () => {
    console.log("hello");
    const users = await User.find().select("email");
    const emails = users.map((u) => u.email);
    if (start > Date.now() && end > start) {
      const items = await Item.find();
      const handleItem = async (arr, id) => {
        const item = arr.find((item) => {
          return item._id.toString() === id.toString();
        });
        console.log({ item });
        item.pricePay = Math.floor(
          item.priceInput - (item.priceInput * +value.discountPercent) / 100
        );
        item.flashSaleId = saleId;
        await item.save();
      };
      value.items.map((item) => {
        // console.log("id", item.itemId);
        return handleItem(items, item.itemId);
      });
    }
    if (users) {
      console.log({ emails });
      sendMailer(
        emails,
        "you",
        "",
        arrItemId,
        start,
        end,
        percent,
        (isPw = false)
      );
    }
    cronSchedules.stop();
  });
};

module.exports = scheduleSale;

const cron = require("node-cron");

const sendMailer = require("../config/nodemailer");
const User = require("../model/user");

const scheduleSale = (start, end, percent, arrItemId) => {
  const before15 = 15 * 60 * 1000;
  const time = start - before15;
  const day = new Date();
  console.log(day);
  const getSecond = day.getSeconds();
  const getMinute = day.getMinutes() + 1;
  const getHour = day.getHours() - 7;
  const getDay = day.getDate();
  const getMonth = day.getMonth() + 1;
  const daysOfWeek = [0, 2, 3, 4, 5, 6, 7];
  const getWeek = daysOfWeek[day.getDay()];
  const timeString = `* ${getMinute} ${getHour} ${getDay} ${getMonth} *`;
  console.log(timeString);
  const cronSchedules = cron.schedule(
    timeString,
    async () => {
      console.log("Hello");
      const users = await User.find().select("email");
      const emails = users.map((u) => u.email);
      if (users) {
        console.log({ emails });
        sendMailer(emails, "you", "", arrItemId, start, end, percent);
        cronSchedules.stop();
      }
    },
    {
      timezone: "UTC",
    }
  );
};

module.exports = scheduleSale;

const cron = require("node-cron");

const sendMailer = require("../config/nodemailer");
const User = require("../model/user");

const scheduleSale = (start, end, percent, arrItemId) => {
  const before15 = 15 * 60 * 1000;
  console.log({ before15 });
  // const time = start - before15;
  const day = new Date();
  console.log(day);
  // console.log(new Date());
  const getSecond = day.getSeconds() + 4;
  const getMinute = day.getMinutes();
  const getHour = day.getHours() - 8;
  const getDay = day.getDate();
  const getMonth = day.getMonth() + 1;
  const daysOfWeek = [0, 2, 3, 4, 5, 6, 7];
  const getWeek = daysOfWeek[day.getDay()];
  const timeString = `${getSecond} ${getMinute} ${getHour} ${getDay} ${getMonth} *`;
  const string = `${getSecond} ${getMinute} 10 * * *`;
  console.log(string);
  const cronSchedules = cron.schedule(string, async () => {
    console.log("Hello");
    const users = await User.find().select("email");
    const emails = users.map((u) => u.email);
    if (users) {
      console.log({ emails });
      // sendMailer(emails, "you", "", arrItemId, start, end, percent);
      cronSchedules.stop();
    }
  });
};

module.exports = scheduleSale;

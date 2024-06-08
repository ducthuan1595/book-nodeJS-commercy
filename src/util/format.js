exports.getFormatMonth = (time) => {
  const date = new Date(time);
  const month = date.getMonth() + 1;
  return month;
}

exports.getFormatYear = (time) => {
  const date = new Date(time);
  const year = date.getFullYear();
  return year;
};
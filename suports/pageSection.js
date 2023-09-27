module.exports = pageSection = (page, limit, data) => {
  const totalPage = Math.ceil(data.length / +limit);
  const start = (+page - 1) * +limit;
  const end = +page * +limit;
  const result = data.slice(start, end);

  return {
    result,
    totalPage,
  };
};

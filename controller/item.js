const itemService = require("../service/item");

exports.createItem = async (req, res) => {
  const {
    name,
    priceInput,
    pricePay,
    slogan,
    description,
    barcode,
    count,
    categoryId,
    weight,
    author,
  } = req.body;
  const images = req.files.pic;
  const detailPic = req.files?.detailPic;
  const handleImg = (images) => {
    let arrImg = [];
    if (Array.isArray(images)) {
      arrImg = images;
    } else {
      arrImg.push(images);
    }
    return arrImg;
  };
  const imageArr = handleImg(images);
  const detailPicArr = handleImg(detailPic);
  if (
    !name ||
    !priceInput ||
    !description ||
    !barcode ||
    !count ||
    !categoryId ||
    !imageArr.length ||
    !weight ||
    !author
  ) {
    res.status(404).json({ message: "Input invalid" });
  } else {
    const data = await itemService.createItem(
      {
        name,
        priceInput,
        slogan,
        description,
        barcode,
        count,
        categoryId,
        imageArr,
        detailPicArr,
        weight,
        author,
      },
      req
    );
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  }
};

exports.updateItem = async (req, res) => {
  const {
    name,
    priceInput,
    slogan,
    description,
    barcode,
    count,
    categoryId,
    itemId,
    author,
    weight,
  } = req.body;
  const images = req.files?.pic;
  const detailPic = req.files?.detailPic;
  const handleImg = (images) => {
    let arrImg = [];
    if (Array.isArray(images)) {
      arrImg = images;
    } else {
      arrImg.push(images);
    }
    return arrImg;
  };
  const imageArr = handleImg(images);
  const detailPicArr = handleImg(detailPic);

  if (
    !name ||
    !priceInput ||
    !description ||
    !barcode ||
    !count ||
    !categoryId ||
    !itemId ||
    !imageArr.length ||
    !weight ||
    !author
  ) {
    res.status(404).json({ message: "Input invalid" });
  } else {
    const data = await itemService.updateItem(
      {
        name,
        priceInput,
        slogan,
        description,
        barcode,
        count,
        categoryId,
        imageArr,
        detailPicArr,
        itemId,
        weight,
        author,
      },
      req
    );
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  }
};

exports.deleteItem = async (req, res) => {
  const itemId = req.body.itemId;
  if (!itemId) {
    res.status(404).json({ message: "Input invalid" });
  }
  const data = await itemService.deleteItem(itemId, req);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data.data });
  }
};

exports.getAllItem = async (req, res) => {
  // console.log(req.query);
  const key = req.query.key === "null" ? null : req.query?.key;
  const filter = req.query.filter === "null" ? null : req.query?.filter;
  const sort = req.query.sort === "null" ? null : req.query?.sort;
  const limit = req.query.limit === "null" ? null : req.query?.limit;
  const page = req.query.page === "null" ? null : req.query?.page;
  const itemId = req.query?.itemId === "null" ? null : req.query?.itemId;
  const type = req.query?.type === "null" ? null : req.query?.type;
  const column = req.query?.column === "null" ? null : req.query?.column;
  const isSale = req.query?.isSale === "true" ? true : false;
  const data = await itemService.getAllItem(
    key,
    filter,
    sort,
    limit,
    page,
    itemId,
    type,
    column,
    isSale
  );
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};

exports.getAllItemFlashSale = async (req, res) => {
  const data = await itemService.getAllItemFlashSale();
  if (data) {
    res.status(data.status).json({ message: "ok", data: data?.data });
  }
};

exports.getItemFollowPrice = async (req, res) => {
  // console.log(req.query);
  const { low, hight } = req.query;
  if (!low || !hight) {
    res.status(404).json({ message: "Input invalid" });
  }
  const data = await itemService.getItemFollowPrice(low, hight);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};

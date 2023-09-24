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
  } = req.body;
  const images = req.files.images;
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
    !pricePay ||
    !description ||
    !barcode ||
    !count ||
    !categoryId ||
    !imageArr.length ||
    !weight
  ) {
    res.status(404).json({ message: "Input invalid" });
  } else {
    const data = await itemService.createItem(
      {
        name,
        priceInput,
        pricePay,
        slogan,
        description,
        barcode,
        count,
        categoryId,
        imageArr,
        detailPicArr,
        weight,
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
    pricePay,
    slogan,
    description,
    barcode,
    count,
    categoryId,
    itemId,
    weight,
  } = req.body;
  const images = req.files.images;
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
    !pricePay ||
    !description ||
    !barcode ||
    !count ||
    !categoryId ||
    !itemId ||
    !imageArr.length ||
    !weight
  ) {
    res.status(404).json({ message: "Input invalid" });
  } else {
    const data = await itemService.updateItem(
      {
        name,
        priceInput,
        pricePay,
        slogan,
        description,
        barcode,
        count,
        categoryId,
        imageArr,
        detailPicArr,
        itemId,
        weight,
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
  const key = req.query?.key !== "null" ? req.query?.key : null;
  const filter = req.query?.filter !== "null" ? req.query?.filter : null;
  const sort = req.query?.sort !== "null" ? req.query?.sort : null;
  const limit = req.query?.limit !== "null" ? req.query?.limit : null;
  const page = req.query?.page !== "null" ? req.query?.page : null;
  const itemId = req.query?.itemId === "null" ? null : req.query?.itemId;
  const data = await itemService.getAllItem(
    key,
    filter,
    sort,
    limit,
    page,
    itemId
  );
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};

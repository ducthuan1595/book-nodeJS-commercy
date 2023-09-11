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
    !name &&
    !priceInput &&
    !pricePay &&
    !description &&
    !barcode &&
    !count &&
    !categoryId &&
    !imageArr.length &&
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
    !name &&
    !priceInput &&
    !pricePay &&
    !description &&
    !barcode &&
    !count &&
    !categoryId &&
    !itemId &&
    !imageArr.length &&
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
  const data = await itemService.deleteItem(itemId, req);
  if (data) {
    res.status(200).json({ message: data.message, data: data.data });
  }
};

exports.getAllItem = async (req, res) => {
  const key = req.query?.key;
  const data = await itemService.getAllItem(key);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data.data });
  }
};

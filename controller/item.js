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
  } = req.body;
  const images = req.files.images;
  const imageArr = [];
  if (Array.isArray(images)) {
    imageArr = images;
  } else {
    imageArr.push(images);
  }
  if (
    !name &&
    !priceInput &&
    !pricePay &&
    !description &&
    !barcode &&
    !count &&
    !categoryId &&
    !imageArr.length
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
  } = req.body;
  const images = req.files.images;
  const imageArr = [];
  if (Array.isArray(images)) {
    imageArr = images;
  } else {
    imageArr.push(images);
  }
  if (
    !name &&
    !priceInput &&
    !pricePay &&
    !description &&
    !barcode &&
    !count &&
    !categoryId &&
    !itemId &&
    !imageArr.length
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
        itemId,
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

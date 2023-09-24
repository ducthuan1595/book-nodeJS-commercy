const categoryService = require("../service/category");

exports.getAllCategory = async (req, res) => {
  const page = req.query?.page;
  const limit = req.query?.limit;
  const categoryId = req.query?.categoryId;

  const data = await categoryService.getAllCategory(page, limit, categoryId);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  const description = req.body?.description;
  const banner = req.files.banner;
  const position = req.body.position;
  const active = req.body.active;
  let isActive;
  if (active) {
    if (active === "1") {
      isActive = true;
    } else {
      isActive = false;
    }
  }
  let images = [];
  if (Array.isArray(banner)) {
    images = banner;
  } else {
    images.push(banner);
  }
  if (!name || !position || !images.length) {
    res.status(404).json({ message: "Category is invalid!" });
  } else {
    const data = await categoryService.createCategory(
      {
        name,
        images,
        description,
        position,
        isActive,
      },
      req
    );
    if (data) {
      res
        .status(data.status)
        .json({ message: data?.message, data: data?.data });
    }
  }
};

exports.updateCategory = async (req, res) => {
  const { name, categoryId } = req.body;
  const description = req.body?.description;
  const position = req.body.position;
  const banner = req.files?.banner;
  const active = req.body.isActive;
  let isActive;
  if (active) {
    if (active === "1") {
      isActive = true;
    } else {
      isActive = false;
    }
  }
  let images = [];
  if (Array.isArray(banner)) {
    images = banner;
  } else {
    images.push(banner);
  }
  if (!name || !position || !categoryId) {
    res.status(404).json({ message: "Category is invalid!" });
  } else {
    const data = await categoryService.updateCategory(
      {
        name,
        images,
        categoryId,
        description,
        position,
        isActive,
      },
      req
    );
    if (data) {
      res
        .status(data.status)
        .json({ message: data?.message, data: data?.data });
    }
  }
};

exports.deleteCategory = async (req, res) => {
  const { categoryId } = req.body;
  if (!categoryId) {
    res.status(403).json({ message: "Not found" });
  } else {
    const data = await categoryService.deleteCategory(categoryId, req);
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  }
};

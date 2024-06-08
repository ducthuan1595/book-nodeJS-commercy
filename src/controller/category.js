const categoryService = require("../service/category");

exports.getAllCategory = async (req, res) => {
  const page = req.query?.page === "null" ? null : req.query?.page;
  const limit = req.query?.limit === "null" ? null : req.query?.limit;
  const type = req.query?.type === "null" ? null : req.query?.type;
  const column = req.query?.column === "null" ? null : req.query?.column;
  const categoryId =
    req.query?.categoryId === "null" ? null : req.query?.categoryId;

  const data = await categoryService.getAllCategory(
    page,
    limit,
    categoryId,
    type,
    column
  );
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  const description = req.body?.description;
  const banner = req.body.banner;
  const position = req.body.position;
  const active = req.body.isActive;
  let isActive;
  if (active) {
    if (active === "1") {
      isActive = true;
    } else {
      isActive = false;
    }
  }
  if (!name || !position || isActive || !description || !banner) {
    res.status(404).json({ message: "Category is invalid!" });
  } else {
    const data = await categoryService.createCategory(
      {
        name,
        banner,
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
  const { name, categoryId, banner } = req.body;
  const description = req.body?.description;
  const position = req.body.position;
  const active = req.body.isActive;
  let isActive;
  if (active) {
    if (active === "1") {
      isActive = true;
    } else {
      isActive = false;
    }
  }
  if (!name || !position || !categoryId || !banner || !description) {
    res.status(404).json({ message: "Category is invalid!" });
  } else {
    const data = await categoryService.updateCategory(
      {
        name,
        banner,
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

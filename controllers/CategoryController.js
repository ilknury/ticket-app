const Category = require("../models/CategoryModel"); // Import Ticket model

// Get all Categorys
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories) {
      return res.json({
        status: 200,
        message: "Kategori bulunamadı.",
      });
    }
    res.json({
      status: 200,
      message: "Kategoriler başarıyla getirildi.",
      data: categories,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: "Error",
      data: error,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.json({
        status: 404,
        message: "Kategori bulunamadı.",
      });
    }
    return res.json({
      status: 200,
      message: "Kategori başarıyla getirildi.",
      category: category,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: "Error",
      data: error,
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById
};

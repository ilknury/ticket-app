const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryById
} = require("../controllers/CategoryController");

router.get("/all", getAllCategories);
router.get("/:id", getCategoryById);

module.exports = router; // Export router

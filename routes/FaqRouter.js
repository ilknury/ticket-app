const express = require("express");
const router = express.Router();
const {
  getFaqsByCategory 

} = require("../controllers/FaqController");

router.get("/:category", getFaqsByCategory);

module.exports = router; // Export router

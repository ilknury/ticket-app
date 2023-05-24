const express = require("express");
const router = express.Router();
const {
  getAllDepartments,

} = require("../controllers/DepartmentController");

router.get("/all", getAllDepartments);

module.exports = router; // Export router

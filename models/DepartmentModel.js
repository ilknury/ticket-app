const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

const Departments = mongoose.model("Department", DepartmentSchema);

module.exports = Departments;
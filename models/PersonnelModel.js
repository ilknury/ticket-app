const { mongoose } = require("mongoose");
const Department = require("./DepartmentModel");

const PersonnelSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Department,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

const Personnels = mongoose.model("Personnel", PersonnelSchema);

module.exports = Personnels;
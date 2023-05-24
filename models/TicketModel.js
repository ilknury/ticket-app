const mongoose = require("mongoose");
const Department = require("./DepartmentModel");
const Student = require("./StudentModel");
const Category = require("./CategoryModel");

const TicketSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Department,
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Student,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Category,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    trim: true,
    default: null,
  },
  isAnswered: {
    type: Boolean,
    default: false,
  },
  answeredAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Tickets = mongoose.model("Ticket", TicketSchema);

module.exports = Tickets;
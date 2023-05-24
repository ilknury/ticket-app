const mongoose = require("mongoose");
const Department = require("./DepartmentModel");

const StudentSchema = new mongoose.Schema({
    studentNumber: {
        type: String,
        required: true,
        trim: true,
    },
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
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
});

const Students = mongoose.model("Student", StudentSchema);

module.exports = Students;
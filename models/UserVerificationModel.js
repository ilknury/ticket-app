const mongoose = require("mongoose");
const Student = require("./StudentModel");


const UserVerificationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Student,
        required: true,
        unique: true,
    },
    verificationCode: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,  // 1 hour
    },
});

module.exports = mongoose.model("UserVerification", UserVerificationSchema);
const mongoose = require('mongoose');
const Category = require('./CategoryModel');

const FaqModelSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Category,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Faq', FaqModelSchema);
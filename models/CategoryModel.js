const mongoose = require("mongoose");


const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    }
});

const Categories = mongoose.model("Category", CategorySchema);

module.exports = Categories;
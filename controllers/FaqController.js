const Faq = require('../models/FaqModel');

// Get faqs by category
const getFaqsByCategory = async (req, res) => {
    try {
        const faqs = await Faq.find({ category: req.params.category }).populate('category');
        if (!faqs) {
            return res.json({
              status: 200,
              message: "Soru bulunamadı.",
            });
          }
        res.json({
            status: 200,
            message: "Sorular başarıyla getirildi.",
            data: faqs,
        });
    } catch (error) {
        res.json({
            status: 500,
            message: "Error",
            data: error,
        });
    }
};


module.exports = {
    getFaqsByCategory,
};

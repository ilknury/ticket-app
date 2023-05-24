const Department = require("../models/DepartmentModel"); // Import Ticket model

// Get all Departments
const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        if (!departments) {
            return res.json({
              status: 200,
              message: "Bölüm bulunamadı.",
            });
          }
        res.json({
            status: 200,
            message: "Bölümler başarıyla getirildi.",
            data: departments,
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
    getAllDepartments,

};

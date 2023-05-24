const jwt = require("jsonwebtoken");
const Student = require("../models/StudentModel");
const Personnel = require("../models/PersonnelModel");

const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
      return res.json({
        status: 401,
        message: "Erişim engellendi. Token sağlanmadı!",
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findById(decoded._id);
    const personnel = await Personnel.findById(decoded._id);

    if (!student && !personnel)
      return res.json({ status: 404, message: "Kullanıcı bulunamadı!" });

    if (student) req.student = decoded;
    if (personnel) req.personnel = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.json({ status: 500, message: err.message });
  }
};

module.exports = authentication;

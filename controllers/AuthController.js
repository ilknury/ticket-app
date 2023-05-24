const Student = require("../models/StudentModel");
const Personnel = require("../models/PersonnelModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserVerification = require("../models/UserVerificationModel");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const postRegister = async (req, res) => {
  try {
    const { studentNumber, fullName, department, phoneNumber, email } =
      req.body;
    const password = await bcrypt.hash(req.body.password, 12);

    const student = await Student.findOne({
      $or: [{ studentNumber }, { email }, { phoneNumber }],
    });
    if (student) {
      res.json({
        status: 400,
        message:
          "Bu öğrenci numarası, email veya telefon numarası kullanılıyor.",
      });
    } else {
      const newStudent = new Student({
        studentNumber,
        fullName,
        department,
        phoneNumber,
        email,
        password,
      });
      await newStudent.save();

      const verification = new UserVerification({
        studentId: newStudent._id,
        verificationCode: crypto.randomBytes(32).toString("hex"),
      });
      await verification.save();

      // const url = `${process.env.CLIENT_URL}/api/auth/student/${newStudent._id}/verify/${verification.verificationCode}`;
      const url = `${process.env.CLIENT_URL}/verify-email/${newStudent._id}/${verification.verificationCode}`;

      await sendEmail(email, "Hesap Doğrulama", newStudent.fullName, url);

      res.json({
        status: 200,
        message:
          "Kayıt başarılı. Lütfen doğrulama yapmak için email adresinizi kontrol edin.",
      });
    }
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id });
    if (!student) {
      return res.json({
        status: 404,
        message: "Geçersiz url. (ogrenci bulunamadi)",
      });
    }

    const verification = await UserVerification.findOne({
      studentId: req.params.id,
      verificationCode: req.params.verificationCode,
    });

    if (!verification) {
      return res.json({
        status: 404,
        message: "Geçersiz url. (dogrulama kodu bulunamadi)",
      });
    }

    await Student.updateOne({ _id: req.params.id }, { isVerified: true });
    await verification.remove();

    return res.json({
      status: 200,
      message: "Hesabınız başarıyla doğrulandı.",
    });
  } catch (err) {
    return res.json({
      status: 500,
      message: "Sunucu hatası.",
    });
  }
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });

    if (!student) {
      // if student not found
      return res.json({
        status: 404,
        message: "Böyle bir öğrenci bulunamadı.",
        token: null,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, student.password);
    if (!isPasswordMatch) {
      // if password is not match
      return res.json({
        status: 404,
        message: "Parola yanlış.",
        token: null,
      });
    }

    // email ve password doğru. Onaylanmış mı?
    if (!student.isVerified) {
      let verification = await UserVerification.findOne({
        studentId: student._id,
      });
      if (!verification) {
        verification = new UserVerification({
          studentId: student._id,
          verificationCode: crypto.randomBytes(32).toString("hex"),
        });
        await verification.save();
      }
      // const url = `${process.env.CLIENT_URL}/api/auth/student/${student._id}/verify/${verification.verificationCode}`;
      const url = `${process.env.CLIENT_URL}/verify-email/${student._id}/${verification.verificationCode}`;
      await sendEmail(student.email, "Hesap Doğrulama", student.fullName, url);

      return res.send({
        status: 400,
        message: "Doğrulama kodu gönderildi. Lütfen hesabınızı doğrulayın.",
      });
    }

    const token = jwt.sign(
      {
        // Add student info to token
        _id: student._id,
        studentNumber: student.studentNumber,
        fullName: student.fullName,
        department: student.department,
        phoneNumber: student.phoneNumber,
        email: student.email,
        userType: 1,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.json({
      status: 200,
      message: "Giriş başarılı.",
      token: token,
    });

  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
  }
};

const postPersonnelLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const personnel = await Personnel.findOne({ email });
    if (!personnel) {
      // if personnel not found
      res.json({
        status: 404,
        message: "Böyle bir personel bulunamadı.",
        token: null,
      });
    } else {
      const isPasswordMatch = await bcrypt.compare(
        password,
        personnel.password
      );
      if (!isPasswordMatch) {
        // if password is not match
        res.json({
          status: 404,
          message: "Parola yanlış.",
          token: null,
        });
      } else {
        const token = jwt.sign(
          {
            // Add personnel info to token
            _id: personnel._id,
            fullName: personnel.fullName,
            department: personnel.department,
            email: personnel.email,
            userType: 5,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        res.json({
          status: 200,
          message: "Giriş başarılı.",
          token: token,
        });
      }
    }
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
  }
};

const checkToken = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      res.json({
        status: 401,
        message: "Token bulunamadı.",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.userType === 1) {
      user = await Student.findById(decoded._id);
    } else if (decoded.userType === 5) {
      user = await Personnel.findById(decoded._id);
    } else {
      res.json({
        status: 401,
        message: "Token geçersiz.",
      });
    }

    if (!user) {
      res.json({
        status: 404,
        message: "Token geçersiz.",
      });
    } else {
      res.json({
        status: 200,
        message: "Token geçerli.",
        user: decoded,
      });
    }
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
  }
};

module.exports = {
  postRegister,
  verifyEmail,
  postLogin,
  postPersonnelLogin,
  checkToken,
};

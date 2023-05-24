const Ticket = require("../models/TicketModel"); // Import Ticket model

// Create ticket
const createTicket = async (req, res) => {
  try {
    const { student, category, department, title } = req.body;

    const ticket = await Ticket.create({
      student,
      category,
      department,
      title,
    });

    res.json({
      status: 200,
      message: "Ticket başarıyla oluşturuldu.",
      data: ticket,
    });
  } catch (err) {
    res.json({
      status: 500,
      message: "Bir hata oluştu.",
      data: err

    });
  }
};

// Answer ticket
const answerTicket = async (req, res) => {
  try {
    const { ticketId, answer } = req.body;
    
    if(!ticketId || !answer){
      return res.json({
        status: 400,
        message: "Lütfen tüm alanları doldurunuz.",
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        answer,
        isAnswered: true,
        answeredAt: Date.now(),
      },
      { new: true }
    ).populate([
      { path: "student", select: "studentNumber fullName phoneNumber email" },
      { path: "category" },
      { path: "department" },
    ]);


    if (!ticket) {
      return res.json({
        status: 404,
        message: "Ticket bulunamadı.",
      });
    }

    res.json({
      status: 200,
      message: "Ticket başarıyla cevaplandırıldı.",
      data: ticket,
    });
  } catch (err) {
    res.json({
      status: 500,
      message: "Bir hata oluştu.",
    });
  }
};

// Get ticket by id
const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId).populate([
      { path: "student", select: "studentNumber fullName phoneNumber email" },
      { path: "category" },
      { path: "department" },
    ]);

    if (!ticket) {
      return res.json({
        status: 404,
        message: "Ticket bulunamadı.",
      });
    }
    res.json({
      status: 200,
      message: "Ticket başarıyla getirildi.",
      data: ticket,
    });
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
  }
};

// Get tickets by department
const getTicketsByDepartment = async (req, res) => {
  try {
    const { department } = req.body;

    const tickets = await Ticket.find({department})
      .sort({ isAnswered: 1 ,createdAt: -1 })  // Sort by isAnswered and createdAt
      .populate([
        { path: "student", select: "studentNumber fullName phoneNumber email" },
        { path: "category" },
        { path: "department" },
      ]);

    if (!tickets) {
      return res.json({
        status: 404,
        message: "Ticket bulunamadı.",
      });
    }
    res.json({
      status: 200,
      message: "Ticketlar başarıyla getirildi.",
      data: tickets,
    });
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
  }
};

// Get tickets by department
const getTicketsByStudent = async (req, res) => {
  try {
    const { student } = req.body;

    const tickets = await Ticket.find({student})
      .sort({ isAnswered: 1 ,createdAt: -1 })  // Sort by isAnswered and createdAt
      .populate([
        { path: "student", select: "studentNumber fullName phoneNumber email" },
        { path: "category" },
        { path: "department" },
      ]);

    if (!tickets) {
      return res.json({
        status: 404,
        message: "Ticket bulunamadı.",
      });
    }
    res.json({
      status: 200,
      message: "Ticketlar başarıyla getirildi.",
      data: tickets,
    });
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
  }
};


// Get tickets by isAnswered
const getTicketsByIsAnswered = async (req, res) => {
  try {
    const { isAnswered } = req.body;
    const tickets = await Ticket.find({ isAnswered });
    if (!tickets) {
      return res.status(404).json({
        status: 404,
        message: "Ticket bulunamadı.",
      });
    }
    res.json({
      status: 200,
      message: "Ticketlar başarıyla getirildi.",
      data: tickets,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Bir hata oluştu.",
    });
  }
};

module.exports = {
  createTicket,
  answerTicket,
  getTicketById,
  getTicketsByDepartment,
  getTicketsByStudent,
  getTicketsByIsAnswered,
};

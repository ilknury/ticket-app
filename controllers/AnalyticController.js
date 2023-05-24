const Ticket = require("../models/TicketModel");
const Personnel = require("../models/PersonnelModel");
const Student = require("../models/StudentModel");
const Department = require("../models/DepartmentModel");
const Category = require("../models/CategoryModel");

// GET: number of tickets
const totalTickets = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const totalAnsweredTickets = await Ticket.countDocuments({
      isAnswered: true,
    });
    const totalUnansweredTickets = totalTickets - totalAnsweredTickets;

    // Average ticket per personnel
    const totalPersonnel = await Personnel.countDocuments();
    const averageTicketPerPersonnel = totalTickets / totalPersonnel;

    res.json({
      status: 200,
      message: "Success",
      data: {
        total: totalTickets,
        answered: totalAnsweredTickets,
        unanswered: totalUnansweredTickets,
        averageTicketPerPersonnel,
      },
    });
  } catch (error) {
    res.json({ status: 500, message: "Server Error" });
  }
};

// GET: number of personnels
const totalPersonnels = async (req, res) => {
  try {
    const totalPersonnels = await Personnel.countDocuments();
    res.json({ status: 200, message: "Success", count: totalPersonnels });
  } catch (error) {
    res.json({ status: 500, message: "Server Error" });
  }
};

// GET: number of students
const totalStudents = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalVerifiedStudents = await Student.countDocuments({
      isVerified: true,
    });
    const totalUnverifiedStudents = totalStudents - totalVerifiedStudents;

    res.json({
      status: 200,
      message: "Success",
      data: {
        total: totalStudents,
        verified: totalVerifiedStudents,
        unverified: totalUnverifiedStudents,
      },
    });
  } catch (error) {
    res.json({ status: 500, message: "Server Error" });
  }
};

// GET: Average time to answer a ticket
const averageTimeToAnswerTicket = async (req, res) => {
  try {
    const answeredTickets = await Ticket.find({ isAnswered: true });
    const totalAnsweredTickets = answeredTickets.length;

    const totalAnswerTime = answeredTickets.reduce((acc, ticket) => {
      const answerTime = ticket.answeredAt - ticket.createdAt;
      return acc + answerTime;
    }, 0);

    const averageTimeToAnswerTicket = totalAnswerTime / totalAnsweredTickets;  // in milliseconds
    const averageTimeInHours = (averageTimeToAnswerTicket / 1000 / 60 / 60).toFixed(2);

    res.json({
      status: 200,
      message: "Success",
      data: {
        // average time in milliseconds and hours
        averageTime: averageTimeToAnswerTicket,
        averageTimeInHours,
      },
    });
  } catch (error) {
    res.json({ status: 500, message: "Server Error" });
  }
};


// For chart data

// GET: number of students by department
const totalStudentsByDepartment = async (req, res) => {
  try {
    const departments = await Department.find();
    const totalStudentsByDepartment = await Student.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
    ]);

    const data = departments.map((department) => {
      const totalStudents = totalStudentsByDepartment.find(
        (item) => item._id.toString() === department._id.toString()
      );
      return {
        department: department.name,
        count: totalStudents ? totalStudents.count : 0,
      };
    });

    res.json({ status: 200, message: "Success", data });
  } catch (error) {
    res.json({ status: 500, message: "Server Error" });
  }
};

// GET: number of tickets by department
const totalTicketsByDepartment = async (req, res) => {
  try {
    const departments = await Department.find();
    const totalTicketsByDepartment = await Ticket.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
    ]);

    const data = departments.map((department) => {
      const totalTickets = totalTicketsByDepartment.find(
        (item) => item._id.toString() === department._id.toString()
      );
      return {
        department: department.name,
        count: totalTickets ? totalTickets.count : 0,
      };
    });

    res.json({ status: 200, message: "Success", data });
  } catch (error) {
    res.json({ status: 500, message: "Server Error" });
  }
};

// GET: number of tickets by category
const totalTicketsByCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    const totalTicketsByCategory = await Ticket.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const data = categories.map((category) => {
      const totalTickets = totalTicketsByCategory.find(
        (item) => item._id.toString() === category._id.toString()
      );
      return {
        category: category.name,
        count: totalTickets ? totalTickets.count : 0,
      };
    });

    res.json({ status: 200, message: "Success", data });
  } catch (error) {
    res.json({ status: 500, message: "Server Error" });
  }
};

module.exports = {
  totalTickets,
  totalPersonnels,
  totalStudents,
  averageTimeToAnswerTicket,
  totalStudentsByDepartment,
  totalTicketsByDepartment,
  totalTicketsByCategory,
};

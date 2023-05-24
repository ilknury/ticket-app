const express = require("express");
const router = express.Router();
const {
  totalTickets,
  totalPersonnels,
  totalStudents,
  averageTimeToAnswerTicket,
  totalStudentsByDepartment,
  totalTicketsByDepartment,
  totalTicketsByCategory,
} = require("../controllers/AnalyticController");

router.get("/total-tickets", totalTickets);
router.get("/total-personnels", totalPersonnels);
router.get("/total-students", totalStudents);
router.get("/average-time-to-answer-ticket", averageTimeToAnswerTicket);

// For chart data
router.get("/total-students-by-department", totalStudentsByDepartment);
router.get("/total-tickets-by-department", totalTicketsByDepartment);
router.get("/total-tickets-by-category", totalTicketsByCategory);




module.exports = router; // Export router

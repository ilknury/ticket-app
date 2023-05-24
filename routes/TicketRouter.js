const express = require("express");
const router = express.Router();
const {
  getTicketsByDepartment,
  createTicket,
  answerTicket,
  getTicketById,
  getTicketsByStudent
} = require("../controllers/TicketController");

router.post("/all", getTicketsByDepartment);
router.post("/all/student", getTicketsByStudent);
router.post("/create", createTicket);
router.post("/answer", answerTicket);
router.post("/get", getTicketById);

module.exports = router;
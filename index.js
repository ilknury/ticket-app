const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json()); // bodyParser for Form


// Middlewares
const isAuthenticated = require("./middlewares/auth");

// Routes
const AuthRouter = require("./routes/AuthRouter");
// const PersonnelRouter = require("./routes/PersonnelRouter");
const TicketRouter = require("./routes/TicketRouter");
const DepartmentRouter = require("./routes/DepartmentRouter");
const CategoryRouter = require("./routes/CategoryRouter");
const FaqRouter = require("./routes/FaqRouter");
const AnalyticRouter = require("./routes/AnalyticRouter");

app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "Welcome to Ticket System App",
  });
});

// Call routes
app.use("/api/auth", AuthRouter);
app.use("/api/ticket", isAuthenticated, TicketRouter);
app.use("/api/department", DepartmentRouter);
app.use("/api/category", CategoryRouter);
app.use("/api/faq", FaqRouter);
app.use("/api/analytic", AnalyticRouter);


// If route not found
app.use("*", (req, res) => {
  res.json({
    status: 404,
    message: "Not Found",
  });
});

// Connect to MongoDB and start server
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(async (result) => {
  app.listen(port, () => {
    console.log(`Listening on ${process.env.BASE_URL} with mongoose`);
  });
});

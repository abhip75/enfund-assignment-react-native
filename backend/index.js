const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const timetableRoutes = require("./routes/timeTableRoutes");
const courseRoutes = require("./routes/courseRoutes");


const app = express();
app.use(cors({
  origin: 'http://localhost:8081', // replace with your frontend domain
  methods: 'GET,POST,PUT,DELETE', // specify allowed methods
  allowedHeaders: 'Content-Type,Authorization', // specify allowed headers
}));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/school-app-data", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use("/api/timetables", timetableRoutes);
app.use("/api/courses", courseRoutes);



app.listen(8000, '0.0.0.0', () => console.log("Server running on http://localhost:8000"));

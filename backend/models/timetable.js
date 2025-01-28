const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema({
  subject: String, 
  time: String, 
  date: String, 
  teacherId: String,
  createdBy: String,
});

module.exports = mongoose.model("Timetable", TimetableSchema);

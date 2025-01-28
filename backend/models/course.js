const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  name: String,
  description: String,
  teacher: String,
});

module.exports = mongoose.model("Course", CourseSchema);

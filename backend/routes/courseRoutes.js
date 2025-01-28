const express = require("express");
const Course = require("../models/course");
const router = express.Router();

// Create Course
router.post("/", async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json(course);
});

// Get All Courses
router.get("/", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Update Course
router.put("/:id", async (req, res) => {
  const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedCourse);
});

// Delete Course
router.delete("/:id", async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;

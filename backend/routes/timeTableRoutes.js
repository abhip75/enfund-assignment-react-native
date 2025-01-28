const express = require("express");
const Timetable = require("../models/timetable");
const PDFDocument = require("pdfkit"); // Import pdfkit
const router = express.Router();

// Create Timetable
router.post("/", async (req, res) => {
  const timetable = new Timetable(req.body);
  await timetable.save();
  res.json(timetable);
});

// Get All Timetables
router.get("/", async (req, res) => {
  const timetables = await Timetable.find();
  res.json(timetables);
});

// Update Timetable
router.put("/:id", async (req, res) => {
  const updatedTimetable = await Timetable.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedTimetable);
});

// Delete Timetable
router.delete("/:id", async (req, res) => {
  await Timetable.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// Assign Timetable to Student
router.post("/:id/assign", async (req, res) => {
  const student = req.body.student; // Student ID or any identifier
  const timetable = await Timetable.findById(req.params.id);

  if (!timetable) {
    return res.status(404).json({ message: "Timetable not found." });
  }

  // Logic to assign the timetable to the student
  timetable.students.push(student); // Assuming students is an array in timetable schema
  await timetable.save();

  res.json({ message: "Timetable assigned to student.", timetable });
});

// Download Timetable (Generate PDF)
router.get("/download/:id", async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);
  if (!timetable) {
    return res.status(404).json({ message: "Timetable not found." });
  }

  // Create a PDF document
  const doc = new PDFDocument();

  // Set headers for the response to indicate a PDF file
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="timetable.pdf"');

  // Pipe the PDF to the response
  doc.pipe(res);

  // Add title and timetable data to the PDF
  doc.fontSize(16).text("Timetable", { align: "center" });
  doc.moveDown();
  
  // Include more detailed timetable data in the PDF
  doc.fontSize(12).text(`Subject: ${timetable.subject}`);
  doc.text(`Time: ${timetable.time}`);
  doc.text(`Date: ${timetable.date}`);
  doc.text(`Teacher ID: ${timetable.teacherId}`);
  
  // If there are multiple students, display their IDs
  if (timetable.studentIds && timetable.studentIds.length > 0) {
    doc.text(`Assigned Students: ${timetable.studentIds.join(", ")}`);
  } else {
    doc.text("No students assigned.");
  }

  // Finalize the PDF and end the stream
  doc.end();
});

module.exports = router;
